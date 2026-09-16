import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// 文章：正文用 Markdown / MDX 写在 src/content/posts/ 下
const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    lang: z.enum(['zh', 'en']).default('zh'),
  }),
});

// 项目：每个项目一个 md 文件，正文写项目说明
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    status: z.enum(['active', 'archived', 'wip']).default('active'),
    stack: z.array(z.string()).default([]),
    repo: z.url().optional(),
    demo: z.url().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(99),
  }),
});

export const collections = { posts, projects };
