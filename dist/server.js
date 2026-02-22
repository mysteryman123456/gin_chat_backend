"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("./config/index");
const mongodb_1 = require("./database/mongodb");
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const error_middleware_1 = require("./middleware/error.middleware");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const file_upload_route_1 = __importDefault(require("./routes/file_upload.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const admin_route_1 = __importDefault(require("./routes/admin.route"));
const conversation_route_1 = __importDefault(require("./routes/conversation.route"));
const socket_server_1 = require("./socket_server");
const http_1 = __importDefault(require("http"));
const message_route_1 = __importDefault(require("./routes/message.route"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use((0, cors_1.default)({
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    origin: [process.env.FRONTEND_URL, "http://localhost:3001"],
    credentials: true,
}));
//
app.use(express_1.default.json());
//
app.use(express_1.default.urlencoded({ extended: true }));
//
app.use((0, cookie_parser_1.default)());
//
(0, mongodb_1.connectToDatabase)();
//
const routes = [
    {
        auth: auth_route_1.default,
        upload: file_upload_route_1.default,
        user: user_route_1.default,
        admin: admin_route_1.default,
        message: message_route_1.default,
        conversation: conversation_route_1.default,
    },
];
//
routes.forEach((route) => {
    Object.entries(route).forEach(([key, value]) => {
        app.use(`/api/${key}`, value);
    });
});
//
app.use(error_middleware_1.errorMiddleware);
//
(0, socket_server_1.initSocketServer)(server);
server.listen(index_1.PORT);
