<script setup lang="ts">
import { appLogo, fileUserAvatarConfig } from '@/config'
import { Collections, pb, type Update } from '@/lib'
import { queryKeys, queryRetryPbNetworkError, useProfileQuery } from '@/queries'
import { useI18nStore } from '@/stores'
import {
  blobToFile,
  compareDatesSafe,
  fetchWithTimeoutPreferred,
  imageCropToRatioService,
  imageLoadImageFromFileService,
  imageResizeImageService,
  potoMessage,
} from '@/utils'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { UploadFile } from 'element-plus'

const i18nStore = useI18nStore()

// 个人信息查询
const profileQuery = useProfileQuery()
const profileAvatarUrl = computed(() => {
  if (
    profileQuery.data.value == null ||
    profileQuery.data.value.avatar === ''
  ) {
    return appLogo
  }
  return pb.files.getURL(
    profileQuery.data.value,
    profileQuery.data.value.avatar,
    { thumb: fileUserAvatarConfig.thumb200x200f }
  )
})

// 图片数据
const imageBlobRef = ref<Blob | null>(null)
// 图片预览链接
const imageUrlRef = ref<string | null>(null)
// 内容中该显示的图片
const imageForShow = computed(() => {
  if (imageUrlRef.value != null) {
    return imageUrlRef.value
  }
  return profileAvatarUrl.value
})

// 图片选择
const onImageSelect = async (uploadFile: UploadFile) => {
  console.log(uploadFile)

  // 检查uploadFile.raw
  ;(() => {
    if (uploadFile.raw === undefined) {
      throw new Error('uploadFile.raw === undefined')
    }
  })()

  // 图片处理
  const imageBlob = await (async () => {
    // 加载文件
    const imageEl = await imageLoadImageFromFileService(uploadFile)
    // 将图片裁剪为1比1
    const imageCropTo11 = imageCropToRatioService(imageEl, 1, 1)
    // 将图片改变大小
    const imageResize = imageResizeImageService(
      imageCropTo11,
      fileUserAvatarConfig.imageResizeNumber,
      fileUserAvatarConfig.imageResizeNumber
    )
    // 将图片转为Blob
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

  // 大小确认
  ;(() => {
    if (imageBlob.size >= fileUserAvatarConfig.imageBlobSizeNotGte) {
      throw new Error('imageBlob.size >= 100000')
    }
  })()

  // 暂存图片
  imageBlobRef.value = imageBlob
  // 暂存图片预览链接
  ;(() => {
    // 释放旧的 URL 对象，防止内存泄漏
    if (imageUrlRef.value != null) {
      URL.revokeObjectURL(imageUrlRef.value)
    }
    imageUrlRef.value = URL.createObjectURL(imageBlob)
  })()
}

// 取消按钮函数
const cancelFn = () => {
  // 释放旧的 URL 对象，防止内存泄漏
  if (imageUrlRef.value != null) {
    URL.revokeObjectURL(imageUrlRef.value)
  }
  imageBlobRef.value = null
  imageUrlRef.value = null
}

// 何时禁用取消按钮
const isDisableCancel = computed(() => {
  if (imageBlobRef.value == null) {
    return true
  }
  return false
})
// 何时禁用提交按钮
const isDisableSubmit = computed(() => {
  if (imageBlobRef.value == null) {
    return true
  }
  return false
})

const queryClient = useQueryClient()

// mutation
const mutation = useMutation({
  // mutation函数
  mutationFn: async () => {
    // 未登录，抛出错误
    if (!pb.authStore.isValid || pb.authStore.record?.id == null) {
      throw new Error(
        '!pb.authStore.isValid || pb.authStore.record?.id == null'
      )
    }

    // 无文件，抛出错误
    if (imageBlobRef.value == null) {
      throw new Error('imageBlobRef.value == null')
    }

    // 准备文件
    const imageFile = blobToFile(imageBlobRef.value, 'image')

    // 准备数据
    const updateData = {
      avatar: imageFile,
    }
    // 类型存在性校验：确保 'avatar' 是 Update<Collections.Users> 的有效键。
    // 该对象不会实际使用，仅用于在类型层面触发错误以验证类型定义的完整性。
    // 如果数据库中 avatar 字段更改为其他，并重新生成类型后，这里就会报错，以此提醒自己修改上面的 updateData
    const _updateData_typeCheck: Update<Collections.Users> = {
      avatar: '',
    }

    // 通过 pocketbase SDK 请求
    const pbRes = await pb
      .collection(Collections.Users)
      .update(pb.authStore.record.id, updateData, {
        // timeout为5000
        fetch: fetchWithTimeoutPreferred,
      })

    console.log(pbRes)
    return pbRes
  },
  // ✅ 在网络错误时重试
  retry: queryRetryPbNetworkError,
  // 成功之后的处理
  onSuccess: (data) => {
    // 更新query缓存
    // 更新前，应确认data.update时间为最新的，以此方式避免两次很近的请求导致问题
    if (
      profileQuery.data.value != null &&
      // data.updated > profileQuery.data.value.updated
      compareDatesSafe(data.updated, profileQuery.data.value.updated) === 1
    ) {
      // 更新query缓存
      queryClient.setQueryData(
        queryKeys.users.getOne(pb.authStore.record?.id ?? ''),
        // 确保类型正确
        data satisfies NonNullable<typeof profileQuery.data.value>
      )
    }
    // 成功后清理 imageBlobRef 等变量
    cancelFn()
    potoMessage({
      type: 'success',
      message: i18nStore.t('messageUpdateSuccess')(),
    })
  },
  // 失败之后的处理
  onError: (error) => {
    potoMessage({
      type: 'error',
      message: i18nStore.t('messageUpdateFailure')(),
    })
  },
})
const isSubmitting = mutation.isPending
const submit = mutation.mutateAsync
</script>

<template>
  <!-- 修改头像组件 -->
  <div>
    <!-- 内容标题 -->
    <div class="mb-3 ml-3 text-sm font-bold text-color-text-soft">
      {{ i18nStore.t('settingProfileUpdateAvatarContentTitle')() }}
    </div>
    <!-- 头像盒子 -->
    <div>
      <!-- 居中 -->
      <div class="flex justify-center">
        <!-- ElUpload -->
        <!--
        将这个div换为ElUpload
        单个文件，只允许 png jpg webp
        用户点击这个后不是会选择文件吗，选择文件后打印文件信息
        -->
        <div class="upload-box">
          <ElUpload
            :autoUpload="false"
            :showFileList="false"
            :onChange="onImageSelect"
            accept="image/png,image/jpeg,image/webp"
            drag
          >
            <div
              class="cursor-pointer rounded-full border-2 border-dashed border-color-text-soft transition-colors hover:border-el-primary"
            >
              <div
                class="m-[1px] h-[100px] w-[100px] overflow-hidden rounded-full"
              >
                <img
                  :src="imageForShow"
                  alt="App Icon"
                  class="h-full w-full object-cover"
                />
              </div>
            </div>
          </ElUpload>
        </div>
      </div>
    </div>
    <!-- 按钮盒子 -->
    <div class="poto-setting-button-box center-mt-3">
      <ElButton
        :loading="isSubmitting"
        type="primary"
        round
        :disabled="isDisableSubmit"
        @click="submit()"
      >
        {{ i18nStore.t('settingButtonSave')() }}
      </ElButton>
      <ElButton
        type="info"
        round
        :disabled="isDisableCancel"
        @click="cancelFn()"
      >
        {{ i18nStore.t('settingButtonCancel')() }}
      </ElButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.upload-box {
  :deep() {
    .el-upload {
      .el-upload-dragger {
        background-color: unset;
        border: none;
        padding: 0;
      }
    }
  }
}
</style>
