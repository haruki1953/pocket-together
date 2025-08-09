<script setup lang="ts">
import { fileUserAvatarConfig } from '@/config'
import { useI18nStore } from '@/stores'
import { imageLoadImageFromBlobService, imageResizeImageService } from '@/utils'
// 图片裁剪依赖
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

const i18nStore = useI18nStore()

const originalImage = defineModel<string | null>('originalImage', {
  required: true,
})
const imageUrlRef = defineModel<string | null>('imageUrlRef', {
  required: true,
})
const imageBlobRef = defineModel<Blob | null>('imageBlobRef', {
  required: true,
})

const cropDialogVisible = ref(false)
const open = () => {
  cropDialogVisible.value = true
}
const close = () => {
  cropDialogVisible.value = false
}

defineExpose({
  open,
  close,
})

// 引用 vue-advanced-cropper 组件
const cropperRef = ref<InstanceType<typeof Cropper> | null>(null)

// 成功拿到裁剪好又转化成了 Blob 的图片后
// 对 Blob 进行调整 尺寸、压缩 验证大小 更新预览
const crop = () => {
  if (cropperRef.value != null) {
    const result = cropperRef.value.getResult()
    result.canvas?.toBlob(
      async (blob) => {
        if (blob != null) {
          const imageBlob = await (async () => {
            // 使用函数11将裁剪的 Blob 加载成 url 存到 imageEl
            const imageEl = await imageLoadImageFromBlobService(blob)
            // 将图像尺寸统一调整为预设值q
            const imageResize = imageResizeImageService(
              imageEl,
              fileUserAvatarConfig.imageResizeNumber,
              fileUserAvatarConfig.imageResizeNumber
            )
            const imageBlob = await new Promise<Blob>((resolve) => {
              imageResize.toBlob(
                (blob) => {
                  if (!blob) {
                    throw new Error()
                  }
                  resolve(blob)
                },
                fileUserAvatarConfig.toBlobType,
                fileUserAvatarConfig.toBlobQuality
              )
            })
            return imageBlob
          })()

          // 验证处理后 Blob 大小
          ;(() => {
            if (imageBlob.size >= fileUserAvatarConfig.imageBlobSizeNotGte) {
              throw new Error('imageBlob.size >= 100000')
            }
          })()
          // 释放旧 URL 对象
          if (imageUrlRef.value != null) {
            URL.revokeObjectURL(imageUrlRef.value)
          }
          imageBlobRef.value = imageBlob
          // 在这一步为前面的 裁剪后图片的预览 URL 赋值
          imageUrlRef.value = URL.createObjectURL(imageBlob)
        }
        // 关闭
        cropDialogVisible.value = false
      },
      fileUserAvatarConfig.toBlobType,
      fileUserAvatarConfig.toBlobQuality
    )
  }
}
</script>

<template>
  <div class="crop-dialog">
    <!-- 裁剪对话框 -->
    <ElDialog
      v-model="cropDialogVisible"
      :title="i18nStore.t('settingProfileUpdateAvatarDialogTitle')()"
      width="80%"
    >
      <div class="flow-root rounded-t-3xl bg-color-background-soft">
        <!-- title -->
        <div class="my-0 hidden xl:my-4 xl:block">
          <span class="m-8 text-xl font-bold text-color-text-soft">{{
            i18nStore.t('settingProfileUpdateAvatarDialogTitle')()
          }}</span>
        </div>
        <div class="mx-0 xl:mx-8">
          <div
            class="relative flex h-[600px] w-full justify-center overflow-hidden rounded-t-3xl xl:h-[400px] xl:rounded-3xl"
          >
            <img
              v-if="originalImage"
              :src="originalImage"
              class="absolute left-0 top-0 h-full w-full scale-110 object-cover opacity-40 blur-lg"
            />
            <Cropper
              v-if="originalImage"
              ref="cropperRef"
              :src="originalImage"
              :stencilProps="{
                aspectRatio: 1,
              }"
              class="cropperBg"
            />
          </div>
          <!-- 占位 div -->
          <div class="h-[2px] w-full"></div>
        </div>
      </div>
      <!-- 再复制一份样式创建按钮 -->
      <div
        class="mt-[2px] flow-root rounded-b-3xl bg-color-background-soft xl:mt-0"
      >
        <div
          class="poto-setting-button-box not-center mb-4 mr-2 mt-2 xl:mr-8 xl:mt-4"
        >
          <span class="dialog-footer">
            <ElButton round @click="cropDialogVisible = false">{{
              i18nStore.t('settingProfileUpdateAvatarDialogCancelButton')()
            }}</ElButton>
            <ElButton type="primary" round @click="crop">{{
              i18nStore.t('settingProfileUpdateAvatarDialogCropButton')()
            }}</ElButton>
          </span>
        </div>
      </div>
    </ElDialog>
  </div>
</template>

<style lang="scss" scoped>
.cropperBg {
  :deep() {
    .vue-advanced-cropper__background,
    .vue-advanced-cropper__wrapper {
      background-color: unset;
    }
  }
}
</style>
