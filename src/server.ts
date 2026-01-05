import express from "express";
import { PORT } from "./config/index";
import { connectToDatabase } from "./database/mongodb";
import authRoutes from "./routes/auth.route";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connectToDatabase();

const routes = [{ auth: authRoutes }];

routes.forEach((route) => {
  Object.entries(route).forEach(([key, value]) => {
    app.use(`/api/${key}`, value);
  });
});

app.use(errorMiddleware);

app.listen(PORT);
