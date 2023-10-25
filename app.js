import express from "express";
import cors from 'cors';
import morgan from "morgan";
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';

config();
const app = express();
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(express.json());

app.use(cors({
    origin: frontendUrl,
    credentials: true
}));

app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.use("/ping", function (req, res, next) {
    res.send("Pong");
    next();
})

export default app;