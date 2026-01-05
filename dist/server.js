"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("./config/index");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/api/value", (req, res) => {
    res.send("Hello, world!");
});
app.get("/api/status", (req, res) => {
    res.json({ status: "OK", timestamp: new Date() });
});
app.listen(index_1.PORT);
