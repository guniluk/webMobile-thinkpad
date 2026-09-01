import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// create ratelimiter 100 requests per 1 minutes
export const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(100, "60s"),
});
