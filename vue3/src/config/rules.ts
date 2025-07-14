import type { I18nMessagesKeyType } from './i18n'

export const rulesUsername = {
  /**
   * 字符规则 Char
   * `/^[a-zA-Z0-9_]*$/`
   */
  patternChar: /^[a-zA-Z0-9_]*$/,
  /**
   * 长度规则 Length
   * `/^.{1,32}$/`
   */
  patternLength: /^.{1,32}$/,
} as const

export const rulesPassword = {
  /**
   * 最小长度规则（8位及以上）
   * `/^.{8,}$/`
   */
  patternMinLength: /^.{8,}$/,
} as const
