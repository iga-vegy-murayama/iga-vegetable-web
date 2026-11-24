// Cloudflare Workers の入口。/api/contact だけを処理し、ほかは dist/ の静的ファイルを返す。
import { handleContact, type Env as ContactEnv } from './contact';

interface Env extends ContactEnv {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
      return handleContact(request, env);
    }
    const res = await env.ASSETS.fetch(request);
    // 確認用URL（*.workers.dev）は検索エンジンに載せない
    if (url.hostname.endsWith('.workers.dev')) {
      const r = new Response(res.body, res);
      r.headers.set('X-Robots-Tag', 'noindex, nofollow');
      return r;
    }
    return res;
  },
};
