import { Hono } from "hono";
import {listUsers, getUsers, createUsers,updateUsers,deleteUser, resetPasswordController} from "./users.Controller"

export const usersRouter = new Hono();

usersRouter
.get("/users",listUsers)
.get("/users/:id", getUsers)
.post("/users", createUsers)
.put("/users/:id",updateUsers)
.delete("/users/:id", deleteUser)
.post("/reset-password", resetPasswordController)