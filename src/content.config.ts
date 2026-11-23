import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// 取り組み（プロジェクト）。各ページは「背景 → 伊賀ベジの役割 → いまの状況 → 関連リンク」の型で書く。
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    status: z.enum(['実施中', '構想']),
    theme: z.enum(['流通', '技術', '人', '土', 'エネルギー']),
    order: z.number().default(100),
    links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
  }),
});

// 実績・事例。「課題 → したこと → 結果」の型。社名は許諾が取れるまで伏せる。
const works = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/works' }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    category: z.enum(['産地づくり', '講師・研修', 'システム', '流通']),
    summary: z.string(),
    permission: z.boolean().default(false), // 社名掲載の許諾
    order: z.number().default(100),
  }),
});

export const collections = { projects, works };
