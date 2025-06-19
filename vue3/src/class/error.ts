/**
 * 自定义一个错误类，以便于判断表单校验所抛出的错误
 * await form.value?.validate().catch(() => {throw new PotoFormValidationError()})
 * Poto单纯是指本项目名（pocket together）
 */
export class PotoFormValidationError extends Error {
  constructor(message = 'Form validation failed') {
    super(message)
    this.name = 'PotoFormValidationError'
  }
}
