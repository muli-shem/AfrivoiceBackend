import { Context } from "hono";
import { PostsService, createPostService, getPostsService, updatePostService, deletePostService } from "./posts.Service";
import { posts } from "../drizzle/schema";

export const listPosts = async (C:Context)=>{
    try{
        const limit = Number(C.req.query("limit"));
        const data = await PostsService(limit);
        if(data ===null|| data.length==0){
            return C.text("No Posts found");
        }
        return C.json(data);
    }catch(error:any){
        return C.json({error}, 400)
    }  
}

export const createPost = async (C:Context) => {
    try {
        const posts = await C.req.json();
        const newPost = await createPostService(posts);
        if (!newPost) return C.text("Post not created", 400);
        return C.json({ msg: newPost }, 201);
        } catch (error: any) {
            return C.json({ error }, 400);
        }
}

export const getPost = async (C: Context) => {
    try {
        const id = C.req.param("id");
        const post = await getPostsService(Number(id));
        if (!post) return C.text("Post not found", 404);
        return C.json(post);
    }
    catch (error: any) {
        return C.json({ error }, 400);
    }
}

export const updatePost = async (C: Context) => {
    try {
        const id = C.req.param("id");
        const posts = await C.req.json();
        const updatedPost = await updatePostService(Number(id), posts);
        if (!updatedPost) return C.text("Post not updated", 400);
        return C.json(updatedPost);
    }
    catch (error: any) {
        return C.json({ error }, 400);
    }
}

export const deletePost = async (C: Context) => {
    try {
        const id = C.req.param("id");
        await deletePostService(Number(id));
        return C.text("Post deleted");
    }
    catch (error: any) {
        return C.json({ error }, 400);
    }
}