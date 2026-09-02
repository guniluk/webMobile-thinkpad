import { ratelimit } from "../utils/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    const identifier = req.ip || req.headers["x-forwarded-for"] || "anonymous";
    const limitResult = await ratelimit.limit(identifier);

    res.setHeader("X-RateLimit-Limit", limitResult.limit);
    res.setHeader("X-RateLimit-Remaining", limitResult.remaining);
    res.setHeader("X-RateLimit-Reset", limitResult.reset);

    if (!limitResult.success) {
      return res.status(429).json({
        error: "Too many requests",
        message: "요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.",
        limit: limitResult.limit,
        remaining: limitResult.remaining,
        reset: limitResult.reset,
      });
    }
    next();
  } catch (error) {
    console.error("Rate limiter error:", error);
    next();
  }
};

export default rateLimiter;
