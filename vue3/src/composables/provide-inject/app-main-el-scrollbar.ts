import type { ElScrollbar } from 'element-plus'

export type AppMainElScrollbarVal = InstanceType<typeof ElScrollbar>
export type AppMainElScrollbar = Ref<AppMainElScrollbarVal | null>

/**
 * 为 provide / inject 标注类型
 * https://cn.vuejs.org/guide/typescript/composition-api#typing-provide-inject
 * 使用 Symbol 作注入名
 * https://cn.vuejs.org/guide/components/provide-inject#working-with-symbol-keys
 */
const key = Symbol() as InjectionKey<AppMainElScrollbar>

export const provideAppMainElScrollbar = (data: AppMainElScrollbar) => {
  provide(key, data)
}

export const injectAppMainElScrollbar = () => {
  const data = inject(key)
  // 响应式变量本身不为null（Ref<null>整体不为null），一般要进行这样的判断
  if (data == null) {
    throw new Error('injectAppMainElScrollbar data == null')
  }
  return data
}
