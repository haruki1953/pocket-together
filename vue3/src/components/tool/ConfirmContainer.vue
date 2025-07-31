<script setup lang="ts">
import { useI18nStore } from '@/stores'
import { ref } from 'vue'

const defaultBackgroundColorTwcss = 'bg-color-background'

/**
 * 遮罩确认框，暴露 confirm 方法给父组件使用，父组件 await 以等待确认
 */
withDefaults(
  defineProps<{
    /**
     * 是否不显示遮罩背景色（默认显示）
     */
    backgroundNone?: boolean

    /**
     * 遮罩层的背景颜色，默认值为 bg-color-background ：
     * background-color: var(--color-background);
     */
    backgroundColorTwcss?: string

    /**
     * 按钮等内容的的尺寸，可选 'default' 或 'small'
     */
    size?: 'default' | 'small'

    /**
     * 标题内容
     */
    title?: string

    /**
     * “确认”按钮类型（ElementPlus 类型：primary/success/warning/danger/info）
     */
    confirmType?: 'primary' | 'success' | 'warning' | 'danger' | 'info'

    /**
     * “确认”按钮显示文字
     */
    confirmText?: string

    /**
     * “取消”按钮类型（ElementPlus 类型：primary/success/warning/danger/info）
     */
    cancelType?: 'primary' | 'success' | 'warning' | 'danger' | 'info'

    /**
     * “取消”按钮显示文字
     */
    cancelText?: string
  }>(),
  {
    backgroundNone: false,
    backgroundColorTwcss: defaultBackgroundColorTwcss,
    confirmType: 'primary',
    // confirmText: '确认',
    cancelType: 'info',
    // cancelText: '取消',
  }
)

const i18nStore = useI18nStore()

// 控制遮罩的显示状态
const show = ref(false)

// 控制“确认”按钮是否被点击，用于展示 loading 状态
const confirmClicked = ref(false)

// 遮罩确认流程所依赖的 Promise 回调
let confirmResolve: (() => void) | null = null
let confirmReject: (() => void) | null = null

/**
 * 处理“确认”按钮点击逻辑：
 * - 设置 confirmClicked 为 true（用于展示 loading）
 * - 隐藏遮罩
 * - 执行外部 Promise 的 resolve 回调
 */
const handleConfirm = () => {
  confirmClicked.value = true
  show.value = false
  confirmResolve?.()
  confirmResolve = null
  confirmReject = null
}

/**
 * 处理“取消”按钮点击逻辑：
 * - 隐藏遮罩
 * - 执行外部 Promise 的 reject 回调
 */
const handleCancel = () => {
  show.value = false
  confirmReject?.()
  confirmResolve = null
  confirmReject = null
}

/**
 * 暴露给父组件的异步遮罩触发方法
 * - 展示遮罩
 * - 返回 Promise，等待用户点击“确认”或“取消”
 */
const confirm = async () => {
  confirmClicked.value = false
  if (show.value) return
  show.value = true
  return new Promise<void>((resolve, reject) => {
    confirmResolve = resolve
    confirmReject = reject
  })
}

// 暴露 confirm 方法给父组件使用
defineExpose({
  confirm,
})
</script>

<template>
  <div class="confirm-container">
    <div class="container-box">
      <!-- 默认插槽位置，允许父组件插入额外内容 -->
      <slot></slot>

      <!-- 背景层，仅当 show 为 true 且 backgroundNone 为 false 时显示 -->
      <Transition name="fade">
        <div
          v-show="show && !backgroundNone"
          class="mask-background"
          :class="backgroundColorTwcss"
        ></div>
      </Transition>

      <!-- 内容层 -->
      <Transition name="fade">
        <div v-show="show" class="mask-confirm">
          <div class="confirm-box" :class="size">
            <!-- 可选标题显示 -->
            <div v-if="title" class="title-box">{{ title }}</div>
            <div class="button-box">
              <!-- “确认”按钮 -->
              <ElButton
                :type="confirmType"
                round
                :loading="confirmClicked"
                :size="size"
                @click="handleConfirm"
              >
                {{ confirmText ?? i18nStore.t('settingButtonConfirm')() }}
              </ElButton>
              <!-- “取消”按钮 -->
              <ElButton
                :type="cancelType"
                round
                :size="size"
                @click="handleCancel"
              >
                {{ cancelText ?? i18nStore.t('settingButtonCancel')() }}
              </ElButton>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.confirm-box {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title-box {
    font-size: 14px;
    font-weight: bold;
    color: var(--color-text-soft);
    margin-bottom: 10px;
  }
  &.small {
    .title-box {
      margin-bottom: 6px;
    }
  }
}

.container-box {
  position: relative;
}
.mask-background,
.mask-confirm {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.mask-background {
  z-index: 1;
}
.mask-confirm {
  z-index: 2;
}
</style>
