import { Schema, model, models } from "mongoose";

// Backing store for the rate limiter and the one-time captcha nonces.
// Serverless instances share no memory, so counters live in MongoDB and
// the TTL index removes them once their window has passed.
export interface IRateLimit {
  key: string;
  count: number;
  expiresAt: Date;
}

const rateLimitSchema = new Schema<IRateLimit>({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
});

const RateLimitModel =
  models.RateLimit || model<IRateLimit>("RateLimit", rateLimitSchema);
export default RateLimitModel;
