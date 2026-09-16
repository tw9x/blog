# 记录

个人博客站点。用来记录生活片段和自己做过的项目，风格倾向简单、克制，以阅读体验为先。

技术栈：**Astro 7** + **Tailwind CSS v4**，纯静态输出，无后端、无数据库。

## 快速开始

```bash
pnpm install     # 首次安装依赖
pnpm dev         # 本地预览，默认 http://localhost:4321
pnpm build       # 构建到 dist/
pnpm preview     # 预览构建产物
pnpm check       # 类型检查
```

> 注意：`pnpm check` 依赖 TypeScript 6.x。项目已固定在 `6.0.3`，因为 TypeScript 7 的原生编译器尚未提供 `astro check` 所需的 API。

## 写一篇新文章

在 `src/content/posts/` 下新建 `.md` 文件，文件名就是网址（如 `my-post.md` → `/posts/my-post/`）。

```markdown
---
title: 文章标题
description: 一句话摘要，会用于列表页和搜索引擎
pubDate: 2026-09-16
tags: ['随笔']
draft: false
---

正文从这里开始。
```

frontmatter 字段说明：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | 是 | 文章标题 |
| `pubDate` | 是 | 发布日期，支持 `2026-09-16` 或完整时间 |
| `description` | 否 | 摘要，默认为空 |
| `tags` | 否 | 标签数组，默认为空 |
| `draft` | 否 | 为 `true` 时仅在 `dev` 可见，构建产物中排除 |
| `updatedDate` | 否 | 更新日期，填写后会在文章页显示 |
| `lang` | 否 | `zh` 或 `en`，默认 `zh` |

字段写错会**在构建时报错**，而不是悄悄生成一个空白页面。

## 记录一个项目

在 `src/content/projects/` 下新建 md 文件：

```markdown
---
title: 项目名
description: 一句话说明
startDate: 2026-09-01
endDate: 2026-10-01      # 可选，进行中的项目不填
status: active           # active | wip | archived
stack: ['Astro', 'TypeScript']
repo: https://github.com/you/repo   # 可选
demo: https://example.com           # 可选
featured: true           # 是否在首页展示
order: 1                 # 列表排序，数字小的在前
---
```

## 改成你自己的信息

| 想改什么 | 改哪里 |
| --- | --- |
| 站点名、作者、简介 | `src/consts.ts` 的 `SITE` |
| 顶部导航 | `src/consts.ts` 的 `NAV` |
| 域名（影响 RSS 和 og 标签） | `astro.config.mjs` 的 `site` |
| 配色、字体、正文排版 | `src/styles/global.css` |
| 关于页内容 | `src/pages/about.astro` |
| 站点图标 | `public/favicon.svg` |

站点地址要改两处并保持一致：`astro.config.mjs` 的 `site` 和 `src/consts.ts` 的 `SITE.url`。

### 写页面时的注意点

站内链接**不要手写** `href="/posts/"` 这样的绝对路径。部署在子路径时（如 `/blog`），这类路径会 404。统一用 `src/consts.ts` 导出的 `url()`：

```astro
---
import { url } from '../consts';
---
<a href={url('/posts/')}>文章</a>
```

`url()` 会自动加上 `astro.config.mjs` 里 `base` 配置的前缀。静态资源（如 `favicon.svg`）同理。

## 目录结构

```
src/
├── content/
│   ├── posts/            # 文章（Markdown / MDX）
│   └── projects/         # 项目（Markdown / MDX）
├── content.config.ts     # 内容集合的字段校验规则
├── layouts/
│   └── BaseLayout.astro  # 全站外壳：head、导航、页脚
├── components/
│   └── PostList.astro    # 文章列表项
├── pages/
│   ├── index.astro       # 归档：文章与项目合并的时间线
│   ├── posts/            # 文章列表 + 详情
│   ├── projects/         # 项目列表 + 详情
│   ├── about.astro       # 关于
│   └── rss.xml.ts        # RSS 订阅源
├── styles/global.css     # 设计变量、深色模式、正文排版
├── consts.ts             # 站点配置
└── utils.ts              # 取数排序的辅助函数
```

## 部署到 GitHub Pages

当前配置对应 **项目页** `https://tw9x.github.io/blog/`。工作流在 `.github/workflows/deploy.yml`，推送到 `main` 即自动跑「安装 → 类型检查 → 构建 → 发布」。

### 首次部署

1. 在 GitHub 创建仓库，**名字必须是 `blog`**（要改名字见下一节）。
2. 推送代码：
   ```bash
   git remote add origin git@github.com:tw9x/blog.git
   git push -u origin main
   ```
3. 仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。

之后每次推送都会自动重新发布。

### base 与仓库名的约束

`astro.config.mjs` 里的 `base` 必须和仓库名一致，因为项目页的网址就是 `https://<用户名>.github.io/<仓库名>/`。两者不一致时页面能打开但**样式和链接全部 404**（资源请求会打到错误的路径）。

要换成别的仓库名，改两处再推送：

```js
// astro.config.mjs
base: '/你的仓库名',
```

```ts
// src/consts.ts —— 只在换域名/换用户名时才需要动
url: 'https://<用户名>.github.io',
```

改完建议本地跑一次 `pnpm build`，确认产物里的链接都带上了新前缀。

### 换成用户主页或自定义域名

- **用户主页**（仓库名必须是 `<用户名>.github.io`）：删掉 `astro.config.mjs` 里的 `base` 一行。
- **自定义域名**：删掉 `base`，把 `site` 改成 `https://你的域名`，在 `public/CNAME` 写入域名，并在域名商处配置 DNS。

### 其他托管方式

纯静态产物，`dist/` 可直接部署到任意静态托管：

- **Cloudflare Pages / Vercel / Netlify**：构建命令 `pnpm build`，输出目录 `dist`
- **自建服务器**：把 `dist/` 拷到 Nginx 站点目录，注意子路径部署时同样要设 `base`

注意：这类平台通常部署在域名根路径，此时**必须删掉 `base`**，否则链接会带上多余的 `/blog` 前缀。

## 设计说明

几个刻意的取舍：

- **排版优先**。正文最大宽度限制在 42rem 左右，长文行宽更舒服；字号、行高、段间距都单独调过。
- **首页即归档**。首页是一条把文章和项目合并、按年份分组的时间线，不放自我介绍，也没有页脚。全页只有一条竖直基准线，条目以圆点钉在线上，项目用绿色区分。
- **深色模式**。颜色在 `global.css` 的 `@theme` 里定义一次，深色模式覆盖同一批变量，组件里不需要写 `dark:` 前缀。代码高亮的深色配色也做了对应处理。
- **零 JavaScript**。除主题跟随系统外没有交互脚本，页面首屏不依赖 JS。
- **草稿机制**。`draft: true` 的文章本地可见、线上不出现，方便边写边预览。
