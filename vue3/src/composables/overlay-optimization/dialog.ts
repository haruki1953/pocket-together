import { onUnmounted, watch, type Ref } from 'vue'
import {
  optimizationScrollOnOverlayClose,
  optimizationScrollOnOverlayShow,
} from './base'

export const useDialogOptimization = (dependencies: {
  dialogVisible: Ref<boolean>
  overlayClass: string
}) => {
  const { dialogVisible, overlayClass } = dependencies

  watch(dialogVisible, () => {
    if (dialogVisible.value) {
      enableOnDialogShow()
    } else {
      disableOnDialogClose()
    }
  })

  // 对话框打开时
  const enableOnDialogShow = async () => {
    // 禁用滚动，同时防止抖动
    optimizationScrollOnOverlayShow()

    // 这行代码会在历史记录中插入一个状态，以防止返回到上一页面。
    window.history.pushState({ isDialogShow: true }, '', window.location.href)
    // 监听返回事件
    window.addEventListener('popstate', handleBackNavigation)
  }

  // 对话框关闭时，清理监听器与之前添加的历史状态
  const disableOnDialogClose = async () => {
    // 恢复滚动，同时防止抖动
    optimizationScrollOnOverlayClose()

    // 取消返回监听
    window.removeEventListener('popstate', handleBackNavigation)
    // 检查历史状态
    const currentState = window.history.state
    if (
      currentState != null &&
      currentState.isDialogShow != null &&
      currentState.isDialogShow === true
    ) {
      // 删除状态
      window.history.back() // 或者使用其他逻辑恢复到之前的状态
    }
  }
  onUnmounted(() => {
    // 防止在对话框打开时跳转至其他页面，导致滚动锁死
    if (dialogVisible.value) {
      disableOnDialogClose()
    }
  })

  // 返回事件操作
  const handleBackNavigation = () => {
    close()
  }

  // 打开方法
  const open = () => {
    dialogVisible.value = true
  }
  // 关闭方法
  const close = () => {
    // 直接设置为false会导致滚动条提前恢复而导致对话框滚动
    // dialogVisible.value = false
    // 应模拟点击关闭按钮使对话框关闭（即使display:hidden也可以）
    const dialogOverlay = document.querySelector(
      `.${overlayClass} .el-dialog__headerbtn`
    ) as HTMLElement | null
    if (dialogOverlay != null) {
      dialogOverlay.click()
    }
  }

  return {
    open,
    close,
  }
}
