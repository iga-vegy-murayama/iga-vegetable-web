# 伊賀ベジタブルファーム 公式サイト

Astro の静的サイト。Cloudflare Workers（静的アセット）で公開し、お知らせはヘッドレス WordPress（cms.iga-vegetable.jp、Cloudflare Access で保護）から**ビルド時に**読み込みます。

## 開発

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ に出力
npm run todo     # 公開前に埋める「要確認」の残り件数
```

`WP_API_URL` を設定しないと、お知らせはサンプル記事で表示されます（`.env.example` 参照）。

## 構成

| 場所 | 中身 |
|---|---|
| `src/config/site.ts` | 会社名・メニュー・グループ会社・外部リンク・問い合わせの用件（ここを直せば全ページに反映） |
| `src/styles/global.css` | 色・文字・余白の変数（henko.jp と共通化する前提。`--c-brand` だけ差し替え） |
| `src/components/` | ヘッダー、フッター、ページ見出し、問い合わせ導線などの共通部品 |
| `src/content/projects/` | 取り組み（Markdown。背景 → 役割 → いまの状況） |
| `src/content/works/` | 実績・事例（Markdown。課題 → したこと → 結果。社名は許諾後に） |
| `src/lib/wp.ts` | WordPress からお知らせを読む処理 |
| `src/pages/henko/` | 「つなぐ」（へんこ）。将来 henko.jp を統合するときの受け皿 |
| `worker/` | Workers の入口。`/api/contact`（問い合わせ送信：Turnstile＋Brevo）だけ処理し、ほかは `dist/` を返す |
| `wrangler.jsonc` | Workers の設定（ビルドコマンドもここに記載） |
| `public/_redirects` | 旧URLからの 301 転送 |

## Cloudflare との接続

Cloudflare の **Workers & Pages** に Worker として GitHub と接続済み。`main` に push すると自動でビルド・デプロイされる（ビルドは `wrangler.jsonc` の `build.command`）。確認は workers.dev のURLで行う。

### 後で設定するもの

- **カスタムドメイン**（公開時）: Worker → 設定 → ドメインとルート → カスタムドメインに `iga-vegetable.jp` と `www.iga-vegetable.jp`。DNS は同じ Cloudflare。`ai` / `apps0` / `apps1` / `apps` のレコードは触らない。
- **WordPress 連携**: Worker → 設定 → ビルド → 変数に `WP_API_URL`、`CF_ACCESS_CLIENT_ID`、`CF_ACCESS_CLIENT_SECRET`（Access のサービストークン）。投稿の公開で自動ビルドするには、ビルドのデプロイフックを WordPress の公開時フックから呼ぶ。
- **問い合わせフォーム**: ビルド変数に `PUBLIC_TURNSTILE_SITE_KEY`。Worker の変数とシークレットに `TURNSTILE_SECRET`、`BREVO_API_KEY`、`CONTACT_FROM`、`CONTACT_TO`（用件ごとに `CONTACT_TO_SYSTEM` など）。

## 掲載しないもの

財務数値・借入・返済・役員報酬・資本構成などの経営情報は載せない。JICA の名前は案件が正式に動くまで出さない。知足財団のエネルギー・福祉は「構想」と明記する。
