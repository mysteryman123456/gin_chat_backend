import dotenv from "dotenv";

dotenv.config();

export const PORT = 8080;

export const MONGO_URI = process.env.MONGO_URI!;

export const JWT_SECRET = process.env.JWT_SECRET || "this_is_a_default_secret";

export const DEFAULT_PAGINATION_LIMIT = 3;
