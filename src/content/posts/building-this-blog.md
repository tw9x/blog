---
title: 用 Astro 搭一个安静的博客
description: 记录这次重做博客的技术选择：为什么是静态站点，以及内容集合带来的好处。
pubDate: 2026-09-10
tags: ['技术', 'Astro']
---

这是新站点的第一篇技术笔记，记一下搭建过程里做的几个选择。

## 为什么不用动态站点

博客这种内容形态，读写比极低：我自己一天写一篇，读者偶尔翻一翻。为这种场景维护数据库、缓存、后台登录，性价比不高。

静态站点把「内容」和「服务」分开：所有页面在构建时生成成 HTML，托管在任意静态服务上就行，没有服务器要运维，也没有数据库要备份。安全性也顺带解决了——没有后端，就没有后端漏洞。

## 内容即文件

Astro 的内容集合把 Markdown 文件变成有类型的数据。定义一次 schema，之后每篇文章的 frontmatter 都会被校验：

```ts
const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});
```

好处是写错字段名或者漏掉日期，构建时就会报错，而不是等到页面上出现一个空白。

## 几个小设计

- **草稿开关**。`draft: true` 的文章在本地 `dev` 时可见，构建时被排除。写一半的东西可以先推上去。
- **深色模式**。用 CSS 变量配合 `prefers-color-scheme`，组件里不用写任何 `dark:` 前缀。
- **正文排版**。代码高亮交给 Shiki，构建时静态渲染；正文字号、行高、段间距单独调过，长文读起来不累。

## 部署

推送到 GitHub 后由 Actions 构建并发布到 Pages，全程免费。整个站点是纯静态产物，直接扔进任何对象存储也能跑。

## 小结

工具是手段不是目的。这套方案最大的优点不是技术多新，而是**决定已经做完了**：以后想写东西，新建一个 md 文件，写完提交，没有别的步骤。
