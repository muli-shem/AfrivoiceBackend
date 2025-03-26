import { Hono } from "hono";
import { login, register } from "./auth.Controller";


export const authRouter = new Hono();

authRouter.post("/register", register)
authRouter.post("/login", login)
