---
title: 个人博客站
description: 用 Astro 与 Tailwind 搭的静态博客，文章以 Markdown 存放，推送即部署。
startDate: 2026-09-01
status: active
stack: ['Astro', 'Tailwind CSS', 'TypeScript']
featured: true
order: 1
---

这个站点本身就是一个项目。目标很简单：一个写起来不费劲、看起来干净、维护成本接近零的个人站点。

## 需求

动手前先列了几条硬要求，用来砍掉无关的选项：

- 写文章只需要一个 Markdown 文件，不登录后台
- 页面加载快，首屏不依赖 JavaScript
- 支持深色模式，长文阅读体验要舒服
- 部署免费，改动提交后自动上线

## 技术选择

| 关注点 | 选择 | 理由 |
| --- | --- | --- |
| 框架 | Astro | 默认零 JS，内容集合自带类型校验 |
| 样式 | Tailwind CSS v4 | 变量集中定义，深浅色只写一份 |
| 内容 | Markdown / MDX | 纯文本，随时可迁移 |
| 部署 | GitHub Pages | 免费，和仓库天然集成 |

## 结构

```
src/
├── content/
│   ├── posts/      # 文章
│   └── projects/   # 项目
├── layouts/
│   └── BaseLayout.astro
├── components/
│   └── PostList.astro
├── pages/
│   ├── index.astro
│   ├── posts/
│   ├── projects/
│   ├── about.astro
│   └── rss.xml.ts
└── styles/global.css
```

## 做对的地方

**先定内容格式，再写页面。** 内容的 schema 定下来之后，页面要渲染哪些字段就很清楚了，返工少。

**样式变量集中管理。** 颜色只在 `global.css` 的 `@theme` 里定义一次，深色模式覆盖同一批变量，组件里不需要区分主题。

## 遗留问题

- 还没做图片优化流程，文章配图目前要手动压缩
- 搜索功能没有，文章少的时候用不上，数量上来再说
- 评论系统暂时不打算加，有反馈直接发邮件

## 后续

优先级最高的是把写作流程再缩短一点：现在新建文章要手写 frontmatter，打算加一个脚本生成模板。
