#!/usr/bin/env node
/**
 * 部署前自检：确认产物里的站内链接都带上了 base 前缀。
 *
 * 这个脚本防的是最隐蔽的一类部署故障：astro.config.mjs 的 base 与 GitHub
 * 仓库名不一致时，本地 pnpm dev 完全正常，线上却样式和链接全部 404。
 * 用法：pnpm build && node scripts/check-base.mjs
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';

if (!existsSync(DIST)) {
  console.error('✗ 找不到 dist/，请先运行 pnpm build');
  process.exit(1);
}

// 从 astro.config.mjs 读取 base，避免和配置文件各写一份而再次不一致
const config = readFileSync('astro.config.mjs', 'utf8');
const match = config.match(/base:\s*'([^']*)'/);
const base = (match?.[1] ?? '').replace(/\/$/, '');
const prefix = base === '' ? '/' : `${base}/`;

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const problems = [];
for (const file of walk(DIST)) {
  if (!file.endsWith('.html')) continue;

  const html = readFileSync(file, 'utf8');
  const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);

  for (const ref of refs) {
    // 只查站内绝对路径：相对路径、外链、协议链接、纯锚点都跳过
    if (!ref.startsWith('/')) continue;
    if (ref.startsWith('//')) continue;
    if (ref === prefix || ref.startsWith(`${prefix}#`)) continue;
    if (base !== '' && !ref.startsWith(prefix)) {
      problems.push(`${relative(DIST, file)} → ${ref}`);
    }
  }
}

// RSS 与 sitemap 里的绝对地址也应包含 base
for (const f of ['rss.xml', 'sitemap-0.xml']) {
  const path = join(DIST, f);
  if (!existsSync(path)) continue;
  const text = readFileSync(path, 'utf8');
  if (base !== '' && !text.includes(`/${base.replace(/^\//, '')}`)) {
    problems.push(`${f} → 未包含 base 前缀 ${base}`);
  }
}

if (problems.length > 0) {
  console.error(`✗ 发现 ${problems.length} 处链接缺少 base 前缀 "${base}"：`);
  for (const p of problems.slice(0, 20)) console.error(`   ${p}`);
  if (problems.length > 20) console.error(`   …… 另有 ${problems.length - 20} 处`);
  console.error('\n请检查 astro.config.mjs 的 base 是否与 GitHub 仓库名一致，');
  console.error('并确认页面里的链接都通过 consts.ts 的 url() 生成。');
  process.exit(1);
}

console.log(`✓ 站内链接前缀检查通过（base = "${base || '/'}"）`);
