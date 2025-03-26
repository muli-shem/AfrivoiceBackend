import {Context} from "hono";
import {EducationService, getEducationService,createEducationService,updateEducationService,deleteEducationService} from "./education.Service";
import { educational_content } from "../drizzle/schema";

export const ListContent = async (c:Context) =>{
    try{
        const limit = Number(c.req.query("limit"));
        const educations = await EducationService(limit);
        if(educations===null||educations.length==0){
        return c.text("Content not found", 404);
    }
    return c.json(educations);
    }catch(error:any){
        return c.json({error},400);
    }
}

export const GetContentById = async (c:Context) =>{
    const content_id = parseInt(c.req.param("id"));
    if(isNaN(content_id)) return c.text("Invalid ID", 400);
    const content = await getEducationService(content_id);
    if(content===undefined){
        return c.text("Content not found", 404);
    }
    return c.json(educational_content, 200);
}

export const CreateContent = async (c:Context) =>{
    try{
        const content = await c.req.json();
        const createContent = await createEducationService(content);
        if(!createContent) return c.text("Content not created", 400);
        return c.json({msg: createContent}, 201);    
    }catch(error:any){
        return c.json({error:error.message}, 400);
    }
}
export const updateContent = async (c:Context) =>{
    const id = parseInt(c.req.param("id"));
    if(isNaN(id)) return c.text("Invalid ID", 400);
    const content = await c.req.json();
    try{
        const searchedContent = await getEducationService(id);
        if(searchedContent == undefined) return c.text("Content not found", 400);
        const res = await updateEducationService(id, content);
        if(!res) return c.text("Content not updated", 400);
        return c.json({msg: res}, 200);
    }catch (error:any){
        return c.json({error: error?.message}, 400);
    }
}
export const deleteContent = async (c:Context) =>{
    const id = parseInt(c.req.param("id"));
    if(isNaN(id)) return c.text("Invalid ID", 400);
    try{
        const searchedContent = await getEducationService(id);
        if(searchedContent == undefined) return c.text("Content not found", 400);    
        const res = await deleteEducationService(id);
        if(!res) return c.text("Content not deleted", 400);
        return c.json({msg: res}, 200);
    }catch (error:any){
        return c.json({error: error?.message}, 400);
    }
    
}
    