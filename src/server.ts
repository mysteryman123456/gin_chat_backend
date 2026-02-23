import express, { Request, Response } from "express";
import { PORT } from "./config/index";
import { connectToDatabase } from "./database/mongodb";
import authRoutes from "./routes/auth.route";
import { errorMiddleware } from "./middleware/error.middleware";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUploadRoute from "./routes/file_upload.route";
import userRoute from "./routes/user.route";
import adminRoutes from "./routes/admin.route";
import conversationRoutes from "./routes/conversation.route";
import { initSocketServer } from "./socket_server";
import http from "http";
import messageRoute from "./routes/message.route";

const app = express();

const server = http.createServer(app);

app.use(
  cors({
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    origin: process.env.FRONTEND_URL!,
    credentials: true,
  })
);
//
app.use(express.json());
//
app.use(express.urlencoded({ extended: true }));
//
app.use(cookieParser());
//
connectToDatabase();
//
const routes = [
  {
    auth: authRoutes,
    upload: fileUploadRoute,
    user: userRoute,
    admin: adminRoutes,
    message: messageRoute,
    conversation: conversationRoutes,
  },
];
//
routes.forEach((route) => {
  Object.entries(route).forEach(([key, value]) => {
    app.use(`/api/${key}`, value);
  });
});
//
app.get("/api/health", (req: Request, res: Response) => {
  return res.status(200).json({ success: true });
});
app.use(errorMiddleware);
//
initSocketServer(server);
server.listen(PORT);
