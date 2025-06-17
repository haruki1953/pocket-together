import {
  i18nDefaultLocale,
  i18nMessages,
  type I18nLocaleType,
  type I18nMessagesKeyType,
} from '@/config/i18n'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useI18nStore = defineStore(
  'vue-starter-250611-i18n',
  () => {
    // type I18nLocaleType = "en-US" | "zh-CN" | "zh-TW" ……
    const locale = ref<I18nLocaleType>(i18nDefaultLocale)

    const localeSet = (code: I18nLocaleType) => {
      locale.value = code
    }

    /**
     * 好多i18n库都用t命名(translate)，来获取语言内容
     */
    const t = <MessageKey extends I18nMessagesKeyType>(
      messageKey: MessageKey
    ) => {
      return i18nMessages[messageKey][
        locale.value
      ] as (typeof i18nMessages)[MessageKey][I18nLocaleType]
    }

    return {
      locale,
      localeSet,
      t,
    }
  },
  {
    persist: true, // 持久化
  }
)
