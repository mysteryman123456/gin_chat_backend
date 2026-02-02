import express from "express";
import { PORT } from "./config/index";
import { connectToDatabase } from "./database/mongodb";
import authRoutes from "./routes/auth.route";
import { errorMiddleware } from "./middleware/error.middleware";
import cors from "cors";
import cookieParser from "cookie-parser";
import imageUploadRoute from "./routes/image_upload.route";
import userRoute from "./routes/user.route";
import adminRoutes from "./routes/admin.route";

const app = express();

app.use(
  cors({
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    origin: ["http://localhost:3000", "http://localhost:3001"],
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
    upload: imageUploadRoute,
    user: userRoute,
    admin: adminRoutes,
  },
];
//
routes.forEach((route) => {
  Object.entries(route).forEach(([key, value]) => {
    app.use(`/api/${key}`, value);
  });
});
//
app.use(errorMiddleware);
//
app.listen(PORT);
