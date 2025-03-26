import { Hono } from "hono";
import { listPosts, getPost, createPost, updatePost, deletePost } from "./posts.Contoller";
export const postsRouter = new Hono();
postsRouter.get("/posts", listPosts)
    .get("/posts/:id", getPost)
    .post("/posts", createPost)
    .put("/posts/:id", updatePost)
    .delete("/posts/:id", deletePost);
