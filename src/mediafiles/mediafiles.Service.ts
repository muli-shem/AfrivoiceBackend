import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import {TSMediafiles, TIMediafiles, media_files} from "../drizzle/schema"

export const listMediafilesService = async (limit?:number):Promise<TSMediafiles[]|null>=>{
    if(limit){
        return await  db.query.media_files.findMany({
            limit:limit
        })
        
    }
    return await db.query.media_files.findMany()
}
export const getMediafilesService = async (id:number): Promise<TSMediafiles| undefined>=>{
    return await db.query.media_files.findFirst({
        where : (mediafiles) => eq(mediafiles.id, id)
    })
}

export const createMediafilesService = async (mediafiles :TIMediafiles)=>{
    return await db.insert(media_files).values(mediafiles)
    return "Media file created successfully"
}

export const updateMediafilesService = async(id:number, mediafiles:TIMediafiles)=>{
    return await db.update(media_files).set(mediafiles).where(eq(media_files.id, id))
    return "Media file updated successfully"
}

export const deleteMediafilesService = async(id:number)=>{
    return await db.delete(media_files).where(eq(media_files.id, id))
    return "Media file deleted successfully"
}