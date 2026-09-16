import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE, url } from '../consts';
import { getSortedPosts } from '../utils';

export async function GET(context: APIContext) {
  const posts = await getSortedPosts();

  return rss({
    title: SITE.title,
    description: SITE.description,
    // 传部署根地址（含 base 前缀），channel 的 <link> 才指向 /blog/ 而不是站点根
    site: new URL(url('/'), context.site ?? SITE.url).href,
    // 绝对路径会忽略 site 的路径部分，所以这里必须自己带上前缀
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: url(`/posts/${post.id}/`),
    })),
    customData: `<language>${SITE.lang === 'zh' ? 'zh-cn' : 'en-us'}</language>`,
  });
}
