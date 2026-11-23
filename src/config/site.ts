// サイト全体の設定。へんこ（henko.jp）と共通化しやすいよう、
// 会社情報・メニュー・外部リンクはここに集めています。

export const site = {
  name: '伊賀ベジタブルファーム',
  legalName: '伊賀ベジタブルファーム株式会社',
  url: 'https://iga-vegetable.jp',
  catch: '知と技を、社会に実装していく。',
  description:
    '伊賀ベジタブルファームは、有機農業の技術指導・産地づくりの支援と、農産物流通のシステム開発を行う会社です。地域で回せるものは地域で。都市へは、フェアに。',
  philosophy: '自立と共生',
  ogImage: '/og.png',
};

// グループ会社。統合時はここを編集するだけでヘッダー・フッター・構造化データが追従します。
export const group = {
  parent: {
    name: '伊賀ベジタブルファーム株式会社',
    role: '農業生産、栽培技術の指導、産地づくりの支援、システム開発',
    url: 'https://iga-vegetable.jp/',
  },
  subsidiaries: [
    {
      name: '株式会社へんこ',
      short: 'へんこ',
      role: '有機農産物の卸。実際の流通での受発注とコーディネート',
      url: 'https://henko.jp/',
      // 経営統合時はこれを '/henko/' に変え、henko.jp 全体を 301 転送する
    },
  ],
};

export type NavItem = { label: string; sub?: string; href: string; children?: NavItem[] };

export const nav: NavItem[] = [
  { label: '私たちについて', href: '/about/' },
  { label: '伝える', sub: '産地づくりの支援', href: '/consulting/' },
  { label: 'つくる', sub: '流通のシステム', href: '/system/' },
  { label: 'つなぐ', sub: '有機農産物の卸', href: '/henko/' },
  { label: '取り組み', href: '/projects/' },
  { label: '実績', href: '/works/' },
  { label: 'お知らせ', href: '/news/' },
  { label: '採用', href: '/recruit/' },
];

export const external = {
  note: { label: 'note（技術コンテンツ）', href: '#' }, // TODO: note のURL
  farmersDb: { label: 'FARMERS DB（指導動画アーカイブ）', href: 'https://farmers-db.com/jp/' },
  youtube: {
    label: '全国5ブロック講習会（YouTube）',
    href: 'https://www.youtube.com/playlist?list=PLp_IAc1R9zrMZ5uvT32wxfDYhI__7G4Yt',
  },
  henko: { label: 'へんこ（関連会社）', href: 'https://henko.jp/' },
  // 年間生産計画プラットフォーム（FileMaker WebDirect）など。URL確定後に追加。
  platform: null as null | { label: string; href: string },
};

// 問い合わせの用件。contact ページのフォームと Pages Function の振り分けで共用。
export const contactTopics = [
  { id: 'consulting', label: '産地づくり・技術指導・講師のご相談' },
  { id: 'system', label: 'システムの資料請求・デモのご依頼' },
  { id: 'trade', label: '仕入れ・出荷のご相談（へんこ）' },
  { id: 'benibana', label: '紅花のお取引' },
  { id: 'recruit', label: '採用について' },
  { id: 'other', label: '取材・その他' },
] as const;
