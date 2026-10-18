# Header / Footer · EzTutorial

> 综合规范：[../../SITE-CONSISTENCY.md](../../SITE-CONSISTENCY.md)
> 状态：✅ 已对齐（2026-10-18）

## Header

- 全宽 `sticky top:0`，`max-w-shell 984px` + 32px 内边距（移动 20px）。
- 桌面 64px / 移动 56px。
- 品牌 `T` + EzTutorial；导航「首页 / 分类 / 标签 / 归档」；右侧主题 / 搜索 / 汉堡。
- Header **不再放**「Kiang」；主站入口只在 Footer。

## Footer

- 全宽 top-border；品牌 `T` + 「EzTutorial - Kiang 技术笔记」。
- 右侧：**主站 ↗** / RSS 订阅 / Sitemap / © 2026 Kiang。
- 与 Header 导航无重复。

## 主题

- 2 态，默认跟随系统；`localStorage["kiang-theme"]`；`globals.css` 同时保留系统偏好与手动覆盖。
- 图标是「点击动作」语义：亮色 moon、暗色 sun。
- 2026-10-18：按钮 ref + `syncThemeLabel()`，首屏、点击后、无保存偏好时的系统变化都会同步 `aria-label` / `title`。
- Header 主题按钮在桌面和移动端都保留。

## 关键文件

- `eztutorial/components/Layout.tsx`：Header / Footer / 主题按钮。
- `eztutorial/styles/globals.css`：`data-theme` 覆盖 + 主题图标显隐。
- 构建：`npm run build`，静态输出到 `dist/`。

## 验证

```bash
cd eztutorial && npm run build
cd dist && python3 -m http.server 8767
# 检查：Header 64/56、Footer 主站入口、主题切换、无横向溢出
```
