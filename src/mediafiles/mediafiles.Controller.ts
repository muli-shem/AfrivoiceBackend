import { Context } from "hono";
import { media_files } from "../drizzle/schema";
import { listMediafilesService, getMediafilesService, createMediafilesService, updateMediafilesService, deleteMediafilesService } from "./mediafiles.Service";

export const ListMediafiles = async (C:Context)=>{
    try {
        const limit = Number(C.req.query("limit"));
        const data = await listMediafilesService(limit);
        if(data === null||data.length===0){
            return C.text("No data found");
        }
        return C.json(data);
        } catch (error:any) {
            return C.json({ message: error.message }, 500);
    }
}

export const getMediafiles = async (C:Context)=>{
    try {
        const id = parseInt(C.req.param("id"));
        if(isNaN(id)) return C.text("Invalid Id", 400)
        const data = await getMediafilesService(id);
        if(data === undefined){
            return C.json({message:"No data found"},404);
        }
        return C.json(data);
        } catch (error:any) {
            return C.json({ message: error.message }, 500);
    }
}

export const createMediafiles = async(C:Context)=>{
    try {
        const mediafiles =await  C.req.json();
        const data = await createMediafilesService(mediafiles);
        if(!createMediafiles)
            return C.json({message:"Failed to create data"},500);
        return C.json({msg:data},400);
        } catch (error:any) {
            return C.json({ message: error.message }, 500);
            }
        }

export const updateMediafiles = async(C:Context)=>{
    try {
        const id = parseInt(C.req.param("id"));
        if(isNaN(id)) return C.text("Invalid Id", 400)
        const mediafiles = await  C.req.json();
        const data = await updateMediafilesService(id,mediafiles);
        if(!data)
            return C.json({message:"Failed to update data"},500);
        return C.json({msg:data},400);
        } catch (error:any) {
            return C.json({ message: error.message }, 500);
            }
    
    }

export const deleteMediafiles = async(C:Context)=>{
    try {
        const id = parseInt(C.req.param("id"));
        if(isNaN(id)) return C.text("Invalid Id", 400)
        await deleteMediafilesService(id);
        return C.json({msg:"Data deleted successfully"},200);
        } catch (error:any) {
            return C.json({ message: error.message }, 500);
            }
    
}