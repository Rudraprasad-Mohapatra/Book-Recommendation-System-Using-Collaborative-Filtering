import express from "express";
import cors from 'cors';
import morgan from "morgan";
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import bookRoutes from "./router/book.route.js"
import userRoutes from "./router/user.route.js"
import errorMiddleware from "./middlewares/error.middleware.js";

config();
const app = express();
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(express.json());

app.use(cors({
    origin: frontendUrl,
    credentials: true
}));

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));

app.use("/ping", function (req, res, next) {
    res.send("Pong");
    next();
})

app.use("/api/v1/book",bookRoutes);
app.use("/api/v1/user",userRoutes);

app.all("*", (req, res) => {
    res.status(404).send("OOPS!! 404 page not found")
})

app.use(errorMiddleware);

export default app;