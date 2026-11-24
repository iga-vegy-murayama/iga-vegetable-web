// お問い合わせフォームの送信処理（worker/index.ts から呼ばれる）。
// 必要な変数（Cloudflare の Worker > 設定 > 変数とシークレット で登録）:
//   TURNSTILE_SECRET   Cloudflare Turnstile のシークレットキー
//   BREVO_API_KEY      Brevo（現行サイトのフォームでも使用中）のAPIキー
//   CONTACT_FROM       差出人アドレス（Brevoで認証済みのドメイン）
//   CONTACT_TO         既定の宛先
//   CONTACT_TO_SYSTEM など  用件ごとの宛先（任意。CONTACT_TO_<用件IDの大文字>）

export interface Env {
  TURNSTILE_SECRET?: string;
  BREVO_API_KEY: string;
  CONTACT_FROM: string;
  CONTACT_TO: string;
  [key: string]: string | undefined;
}

const TOPICS: Record<string, string> = {
  consulting: '産地づくり・技術指導・講師のご相談',
  system: 'システムの資料請求・デモのご依頼',
  trade: '仕入れ・出荷のご相談（へんこ）',
  benibana: '紅花のお取引',
  recruit: '採用について',
  other: '取材・その他',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });

export async function handleContact(request: Request, env: Env): Promise<Response> {
  const f = await request.formData();
  const get = (k: string) => String(f.get(k) ?? '').trim();

  if (get('website')) return json({ ok: true }); // ボット用のおとり欄

  const topic = get('topic');
  const name = get('name');
  const email = get('email');
  const message = get('message');
  if (!TOPICS[topic] || !name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message || message.length > 10000) {
    return json({ error: '入力内容を確認してください' }, 400);
  }

  if (env.TURNSTILE_SECRET) {
    const v = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET,
        response: get('cf-turnstile-response'),
        remoteip: request.headers.get('CF-Connecting-IP') ?? '',
      }),
    }).then((r) => r.json() as Promise<{ success: boolean }>);
    if (!v.success) return json({ error: '送信の確認に失敗しました' }, 400);
  }

  const to = env[`CONTACT_TO_${topic.toUpperCase()}`] || env.CONTACT_TO;
  const text = [
    `用件: ${TOPICS[topic]}`,
    `お名前: ${name}`,
    `会社・団体名: ${get('org')}`,
    `メール: ${email}`,
    `電話: ${get('tel')}`,
    '',
    message,
  ].join('\n');

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': env.BREVO_API_KEY, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      sender: { email: env.CONTACT_FROM, name: '伊賀ベジタブルファーム Webサイト' },
      to: to.split(',').map((e) => ({ email: e.trim() })),
      replyTo: { email, name },
      subject: `【Webお問い合わせ】${TOPICS[topic]}（${name} 様）`,
      textContent: text,
    }),
  });
  if (!res.ok) return json({ error: '送信できませんでした' }, 502);
  return json({ ok: true });
}
