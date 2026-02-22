"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_PAGINATION_LIMIT = exports.JWT_SECRET = exports.MONGO_URI = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = 8080;
exports.MONGO_URI = process.env.MONGO_URI;
exports.JWT_SECRET = process.env.JWT_SECRET || "this_is_a_default_secret";
exports.DEFAULT_PAGINATION_LIMIT = 3;
