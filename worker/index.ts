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
    return env.ASSETS.fetch(request);
  },
};
