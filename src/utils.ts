import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

/**
 * 取全部文章并按发布时间倒序。开发环境显示草稿，构建产物里排除草稿，
 * 这样 `npm run dev` 能预览未完成的文章，而线上不会露出。
 */
export async function getSortedPosts(): Promise<CollectionEntry<'posts'>[]> {
  const posts = await getCollection('posts', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });

  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getSortedProjects(): Promise<CollectionEntry<'projects'>[]> {
  const projects = await getCollection('projects');
  return projects.sort((a, b) => {
    if (a.data.order !== b.data.order) return a.data.order - b.data.order;
    return b.data.startDate.valueOf() - a.data.startDate.valueOf();
  });
}
