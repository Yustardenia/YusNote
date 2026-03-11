# YusNote Static

YusNote 已重构为基于 Vite 的多页静态站，适合直接部署到 GitHub Pages。

## 结构

- `/` 首页仪表盘
- `/tools/*.html` 纯前端工具页
- `/docs/*.html` 精选内容页

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

构建产物输出到 `dist/`。

## 部署

仓库内已包含 GitHub Pages workflow：

- 推送到默认分支后自动构建
- 使用 GitHub Actions 部署 `dist/`
- `base` 已配置为相对路径，适合仓库子路径访问
