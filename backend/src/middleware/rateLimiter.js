import { ratelimit } from "../utils/upstash.js";

const rateLimiter = async (req, res, next) => {
  const limitResult = await ratelimit.limit(req.ip);
  if (!limitResult.success) {
    return res.status(429).json({ error: "Too many requests" });
  }
  next();
};

export default rateLimiter;
