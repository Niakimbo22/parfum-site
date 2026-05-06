import "server-only";

interface Bucket {
  count: number;
  resetAt: number;
  blockedUntil: number;
}

const buckets = new Map<string, Bucket>();

interface Options {
  windowMs: number;
  max: number;
  blockMs: number;
}

export function rateLimit(key: string, opts: Options): { ok: boolean; retryInMs: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (bucket && bucket.blockedUntil > now) {
    return { ok: false, retryInMs: bucket.blockedUntil - now };
  }

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs, blockedUntil: 0 });
    return { ok: true, retryInMs: 0 };
  }

  bucket.count += 1;
  if (bucket.count > opts.max) {
    bucket.blockedUntil = now + opts.blockMs;
    return { ok: false, retryInMs: opts.blockMs };
  }
  return { ok: true, retryInMs: 0 };
}

export function clearRateLimit(key: string) {
  buckets.delete(key);
}
