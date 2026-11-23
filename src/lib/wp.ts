// ヘッドレスWordPress（cms.iga-vegetable.jp）からお知らせを読み込む。
// ビルド時だけ実行され、公開サイトからWPへは一切アクセスしない。
// WP_API_URL が未設定のときは、下のサンプルで表示する（プレビュー・開発用）。

export type Post = {
  id: number;
  title: string;
  date: string; // ISO
  excerpt: string;
  html: string;
  categories: string[];
};

const API = import.meta.env.WP_API_URL as string | undefined;

function headers(): Record<string, string> {
  const h: Record<string, string> = { Accept: 'application/json' };
  const id = import.meta.env.CF_ACCESS_CLIENT_ID;
  const secret = import.meta.env.CF_ACCESS_CLIENT_SECRET;
  if (id && secret) {
    h['CF-Access-Client-Id'] = id;
    h['CF-Access-Client-Secret'] = secret;
  }
  return h;
}

const strip = (s: string) => s.replace(/<[^>]+>/g, '').replace(/&hellip;|\[&hellip;\]/g, '…').replace(/&nbsp;/g, ' ').trim();

let cache: Post[] | null = null;

export async function getPosts(): Promise<Post[]> {
  if (cache) return cache;
  if (!API) return (cache = samplePosts);
  const out: Post[] = [];
  for (let page = 1; page < 50; page++) {
    const res = await fetch(`${API}/posts?per_page=100&page=${page}&_embed=wp:term&status=publish`, { headers: headers() });
    if (res.status === 400) break; // ページ超過
    if (!res.ok) throw new Error(`WordPress API ${res.status}: ${await res.text()}`);
    const items = (await res.json()) as any[];
    for (const p of items) {
      const terms: any[] = (p._embedded?.['wp:term'] ?? []).flat();
      out.push({
        id: p.id,
        title: strip(p.title.rendered),
        date: p.date,
        excerpt: strip(p.excerpt.rendered),
        html: p.content.rendered,
        categories: terms.filter((t) => t.taxonomy === 'category').map((t) => t.name),
      });
    }
    if (items.length < 100) break;
  }
  return (cache = out.sort((a, b) => b.date.localeCompare(a.date)));
}

export const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

// --- サンプル（WP接続前の表示確認用。内容は仮） ---
const samplePosts: Post[] = [
  {
    id: 3, title: '【サンプル】紅花リーフの出荷を始めました', date: '2026-11-01T09:00:00', categories: ['紅花'],
    excerpt: 'ハウスで育てた紅花のリーフを出荷しています。（WordPress接続後に実際のお知らせに置き換わります）',
    html: '<p>ハウスで育てた紅花のリーフを出荷しています。</p><p>この記事はサンプルです。WordPress接続後に実際のお知らせに置き換わります。</p>',
  },
  {
    id: 2, title: '【サンプル】有機農業アカデミーで講義を行いました', date: '2026-10-15T09:00:00', categories: ['講師・講演'],
    excerpt: '植物生理の講義を担当しました。（サンプル）', html: '<p>サンプル記事です。</p>',
  },
  {
    id: 1, title: '【サンプル】新しいWebサイトを公開しました', date: '2026-10-01T09:00:00', categories: ['お知らせ'],
    excerpt: 'Webサイトを新しくしました。（サンプル）', html: '<p>サンプル記事です。</p>',
  },
];
