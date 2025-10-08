import { z } from 'zod';
import type { ExportedHandler } from '@cloudflare/workers-types';

const envSchema = z.object({
  APP_NAME: z.string().min(1),
  PRODUCTION_ASSETS: z.string().url().optional(),
  PREVIEW_ASSETS: z.string().url().optional(),
  DEV_ASSETS: z.string().url().optional(),
});

type Env = z.infer<typeof envSchema>;

const defaults = {
  production: 'https://goldshore-org.pages.dev',
  preview: 'https://goldshore-org-preview.pages.dev',
  dev: 'https://goldshore-org-dev.pages.dev',
} as const;

const selectOrigin = (hostname: string, env: Env): string => {
  if (hostname.startsWith('preview.')) {
    return env.PREVIEW_ASSETS ?? defaults.preview;
  }

  if (hostname.startsWith('dev.')) {
    return env.DEV_ASSETS ?? defaults.dev;
  }

  return env.PRODUCTION_ASSETS ?? defaults.production;
};

const shouldCacheLong = (pathname: string): boolean =>
  /\.(?:js|css|png|jpg|jpeg|webp|avif|svg)$/i.test(pathname);

export default {
  async fetch(request: Request, rawEnv: Env): Promise<Response> {
    const env = envSchema.parse(rawEnv);
    const url = new URL(request.url);
    const origin = selectOrigin(url.hostname, env);
    const upstreamUrl = new URL(request.url.replace(url.origin, origin));

    const response = await fetch(upstreamUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : await request.blob(),
    });

    const headers = new Headers(response.headers);
    headers.set('x-served-by', env.APP_NAME);
    headers.set(
      'Cache-Control',
      shouldCacheLong(url.pathname)
        ? 'public, max-age=31536000, immutable'
        : 'public, s-maxage=600, stale-while-revalidate=86400',
    );

    return new Response(response.body, { status: response.status, headers });
  },
} satisfies ExportedHandler<Env>;
