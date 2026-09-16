import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// 部署目标：GitHub Pages 项目页 https://tw9x.github.io/blog/
// base 必须与 GitHub 仓库名一致。换成用户主页（tw9x.github.io 仓库）或自定义域名时删掉 base，
// 并同步修改 src/consts.ts 的 SITE.url。
export default defineConfig({
  site: 'https://tw9x.github.io',
  base: '/blog',
  output: 'static',
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
});
