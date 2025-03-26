import {TSEducation, TIEducation , educational_content} from "../drizzle/schema";
import db from "../drizzle/db";
import { eq } from "drizzle-orm";

export const EducationService = async (limit?:number):Promise<TSEducation []| null> =>{
    if (limit){
        return await db.query.educational_content.findMany({
            limit:limit
        })
    }
    return await db.query.educational_content.findMany();
}
export const getEducationService = async(id:number):Promise<TSEducation | undefined> =>{
    return await db.query.educational_content.findFirst({
        where: 
             eq(educational_content.id, id)
    });
}
export const createEducationService = async(Content:TIEducation)=>{
    await db.insert(educational_content).values(Content);
    return "Content created successfully"
}
export const updateEducationService = async(id:number, Content:TIEducation)=>{
    await db.update(educational_content).set(Content).where(eq(educational_content.id, id));
    return "Content updated successfully"
}
export const deleteEducationService = async(id:number)=>{
    await db.delete(educational_content).where(eq(educational_content.id, id));
    return "Content deleted successfully"
}