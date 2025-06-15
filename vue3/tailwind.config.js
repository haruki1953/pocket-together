/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'color-background': "var(--color-background)",
        'color-background-soft': "var(--color-background-soft)",
        'color-background-mute': "var(--color-background-mute)",
        'color-text': "var(--color-text)",
        'color-text-soft': "var(--color-text-soft)",
        // 生成 --el-color-primary-light-1 这种的，参考 src\assets\styles\element-plus.scss
        ...Object.fromEntries(
          [
            "primary", "success", "info", "warning", "danger", "error"
          ].flatMap(type => [
            [`el-${type}`, `var(--el-color-${type})`],
            ...Array.from({ length: 9 }, (_, i) => [`el-${type}-light-${i+1}`, `var(--el-color-${type}-light-${i+1})`]),
            ...Array.from({ length: 9 }, (_, i) => [`el-${type}-dark-${i+1}`, `var(--el-color-${type}-dark-${i+1})`]),
          ])
        ),
      }
    }
  },
  plugins: [],
}

