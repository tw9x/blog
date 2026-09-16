// 站点级配置：改这里就能换掉全站的标题、作者、导航
export const SITE = {
  title: 'Life',
  description: '生活札记。写点值得回看的东西。',
  author: 'tw9x',
  // 部署后的站点根地址，需与 astro.config.mjs 中的 site 保持一致
  url: 'https://tw9x.github.io',
  lang: 'zh',
} as const;

/**
 * 拼接站内绝对路径，自动带上部署前缀（astro.config.mjs 的 base）。
 * 部署到 GitHub Pages 项目页时站点在 /blog 子路径下，
 * 手写 '/posts/' 这类路径会 404，必须统一走这里。
 */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export const NAV = [
  { href: '/', label: '归档' },
  { href: '/posts/', label: '文章' },
  { href: '/projects/', label: '项目' },
  { href: '/about/', label: '关于' },
] as const;

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    // frontmatter 里的日期是 UTC 零点，固定按 UTC 格式化才不会在某些时区偏到前一天
    timeZone: 'UTC',
  }).format(date);
}

/** 时间线用的「月.日」，如 09.16 */
export function formatMonthDay(date: Date): string {
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${month}.${day}`;
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** 粗略估算中文/英文混排的阅读时长 */
export function readingTime(body: string): number {
  const cjk = (body.match(/[\u4e00-\u9fa5]/g) ?? []).length;
  const words = (body.match(/[A-Za-z0-9]+/g) ?? []).length;
  return Math.max(1, Math.round((cjk + words * 1.6) / 400));
}
