import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credential: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes import
import userRouter from "./routes/user.routes.js";
import blogRouter from "./routes/blog.routes.js";

// routes declaration

const ApiVersion = "/api";

app.use(`${ApiVersion}/user`, userRouter)
app.use(`${ApiVersion}/blog`, blogRouter)


app.use(`/`, (req, res) => res.send(defaultReturn)); // Use a callback function to send the defaultReturn
const defaultReturn = {
    "message": "Hello world from blog-backend"
}



/**
 * url :
 */

export { app };
