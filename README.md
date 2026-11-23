# 伊賀ベジタブルファーム 公式サイト

Astro の静的サイト。Cloudflare Pages で公開し、お知らせはヘッドレス WordPress（cms.iga-vegetable.jp、Cloudflare Access で保護）から**ビルド時に**読み込みます。

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
| `functions/api/contact.ts` | 問い合わせフォームの送信（Turnstile＋Brevo） |
| `public/_redirects` | 旧URLからの 301 転送 |

## Cloudflare Pages との接続（ダッシュボードで1回だけ）

1. Cloudflare ダッシュボード → **Workers & Pages** → **作成** → **Pages** → **Git に接続**
2. GitHub を連携し、リポジトリ `iga-vegetable-web` を選ぶ
3. ビルド設定
   - フレームワーク プリセット: **Astro**
   - ビルドコマンド: `npm run build`
   - 出力ディレクトリ: `dist`
   - 環境変数: `NODE_VERSION` = `22`
4. **保存してデプロイ** → `https://iga-vegetable-web.pages.dev` で表示を確認
5. 以降、`main` に push すると自動で本番デプロイ、他のブランチはプレビューURLが発行される

### 後で設定するもの

- **カスタムドメイン**（公開時）: Pages プロジェクト → カスタムドメイン → `iga-vegetable.jp` と `www.iga-vegetable.jp`。DNS は同じ Cloudflare なので自動で設定される。`ai` / `apps0` / `apps1` / `apps` のレコードは触らない。
- **WordPress 連携**: 環境変数に `WP_API_URL`、`CF_ACCESS_CLIENT_ID`、`CF_ACCESS_CLIENT_SECRET`（Access のサービストークン）を登録。Pages プロジェクト → 設定 → **デプロイフック** を作り、その URL を WordPress の公開時フック（例: プラグイン「WP Webhooks」等）から呼ぶと、投稿の公開で自動ビルドされる。
- **問い合わせフォーム**: Turnstile でサイトを作成し、`PUBLIC_TURNSTILE_SITE_KEY`（ビルド用）と `TURNSTILE_SECRET`、`BREVO_API_KEY`、`CONTACT_FROM`、`CONTACT_TO`（用件ごとに `CONTACT_TO_SYSTEM` など）を登録。

## 掲載しないもの

財務数値・借入・返済・役員報酬・資本構成などの経営情報は載せない。JICA の名前は案件が正式に動くまで出さない。知足財団のエネルギー・福祉は「構想」と明記する。
