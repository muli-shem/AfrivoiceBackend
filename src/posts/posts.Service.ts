import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TIPosts, TSPosts, posts } from "../drizzle/schema";

export const PostsService = async (limit?:number):Promise<TSPosts []|null> =>{
    if (limit){
        return await db.query.posts.findMany({
            limit:limit
        })
    }
            return await db.query.posts.findMany(); 
}

export const getPostsService = async (id: number): Promise<TIPosts | undefined> => {
    return await db.query.posts.findFirst({
        where: (row) => eq(row.id, id)
    });
};

export const createPostService = async (post: TIPosts): Promise<TIPosts> => {
    await db.insert(posts).values(post)
    return post
}

export const updatePostService = async (id: number, post: TIPosts): Promise<TIPosts> => {
    await db.update(posts).set(post).where(eq(posts.id, id)).execute();
    return post
}
export const deletePostService = async (id: number) => {
    const post = await db.query.posts.findFirst({
        where: (row) => eq(row.id, id)
    });
    await db.delete(posts).where(eq(posts.id, id)).execute();
    return post
}