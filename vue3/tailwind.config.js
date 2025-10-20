/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
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
        // 自动生成 el-color，生成 --el-color-primary-light-1 这种的，参考 src\assets\styles\element-plus.scss
        ...Object.fromEntries(
          [
            "primary", "success", "info", "warning", "danger", "error"
          ].flatMap(type => [
            [`el-${type}`, `var(--el-color-${type})`],
            ...Array.from({ length: 9 }, (_, i) => [`el-${type}-light-${i + 1}`, `var(--el-color-${type}-light-${i + 1})`]),
            ...Array.from({ length: 9 }, (_, i) => [`el-${type}-dark-${i + 1}`, `var(--el-color-${type}-dark-${i + 1})`]),
          ])
        ),
        // 自动生成透明度背景色变量，参考 src\assets\styles\color.scss
        ...Object.fromEntries(
          [10, 20, 30, 40, 50, 60, 70, 80, 90, 95].flatMap(opacity => [
            [`color-background-a${opacity}`, `var(--color-background-a${opacity})`],
            [`color-background-soft-a${opacity}`, `var(--color-background-soft-a${opacity})`],
            [`color-background-mute-a${opacity}`, `var(--color-background-mute-a${opacity})`],
          ])
        ),
      }
    }
  },
  plugins: [],
}

