/** @type {import('tailwindcss').Config} */
// 视觉体系对齐 kiang.website 主站：
//   - 颜色全部引用 CSS 变量（styles/globals.css），暗色模式由变量切换，组件零改色
//   - 字号/间距/圆角/断点沿用主站 4-8 律（4 档字号 / 8 档间距 / 4 档圆角 / 2 断点）
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // 断点对齐主站：md 980 / sm 640（不要用 Tailwind 默认的 768/1024）
    screens: {
      sm: '640px',
      md: '980px',
      lg: '1200px',
    },
    extend: {
      colors: {
        paper: 'var(--paper)',
        surface: 'var(--surface)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        emerald: 'var(--emerald)',
        'emerald-strong': 'var(--emerald-strong)',
        amber: 'var(--amber)',
        mist: 'var(--mist)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
        mono: 'var(--font-mono)',
      },
      borderRadius: {
        sm: 'var(--r-sm)',
        DEFAULT: 'var(--r-md)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)',
        pill: 'var(--r-pill)',
      },
      spacing: {
        '3xs': 'var(--sp-3xs)',
        '2xs': 'var(--sp-2xs)',
        xs: 'var(--sp-xs)',
        sm: 'var(--sp-sm)',
        md: 'var(--sp-md)',
        lg: 'var(--sp-lg)',
        xl: 'var(--sp-xl)',
        '2xl': 'var(--sp-2xl)',
        '3xl': 'var(--sp-3xl)',
      },
      maxWidth: {
        shell: '984px',
      },
      boxShadow: {
        lift: 'var(--shadow)',
      },
      fontSize: {
        display: 'var(--fs-display)',
        title: 'var(--fs-title)',
        body: 'var(--fs-body)',
        meta: 'var(--fs-meta)',
      },
      lineHeight: {
        tight: 'var(--lh-tight)',
        snug: 'var(--lh-snug)',
        normal: 'var(--lh-normal)',
        relaxed: 'var(--lh-relaxed)',
      },
      letterSpacing: {
        normal: 'var(--ls-normal)',
        wide: 'var(--ls-wide)',
        xwide: 'var(--ls-xwide)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
          },
        },
      },
    },
  },
  plugins: [],
}
