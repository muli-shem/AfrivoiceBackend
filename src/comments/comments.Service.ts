import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import {TSCommentReports, TICommentReports, comments} from "../drizzle/schema"

export const  listCommentreportsService = async(limit?:number): Promise<TSCommentReports[]| null>=>{
    if(limit) {
        return await db.query.comments.findMany({
            limit:limit

        })
        
    }
    return db.query.comments.findMany()
}

export const getCommentreportsService = async(id: number): Promise<TICommentReports|undefined>=>{
    return await db.query.comments.findFirst({
        where: (comments) => eq(comments.id, id)
        
    })
}

export const createCommentreportsService = async(Comment: TICommentReports)=>{
    return await db.insert(comments).values(Comment)
    return "Comment created"

}

export const updateCommentreportsService = async(id: number, Comment: Partial<TICommentReports>)=>{
    return await db.update(comments).set(Comment).where(eq(comments.id, id))
    return "Comment updated"
}

export const deleteCommentreportsService = async(id: number)=>{
    return await db.delete(comments).where(eq(comments.id, id))
    return "Comment deleted"
}