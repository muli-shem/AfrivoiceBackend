import { Context } from "hono";
import { listCommentreportsService,createCommentreportsService, getCommentreportsService, updateCommentreportsService,  deleteCommentreportsService  } from "./comments.Service";
import {comments } from "../drizzle/schema";



export const listComments = async (C:Context)=>{
    try{
        const limit = Number(C.req.query("limit"));
        const data = await listCommentreportsService(limit);
        if(data ===null|| data.length==0){
            return C.text("No feedback_reports found");
        }
        return C.json(data);
    }catch(error:any){
        return C.json({error}, 400)
    }  
}

export const getComments = async (C:Context)=>{
    
        const id = parseInt(C.req.param("id"));
        if (isNaN(id))return C.text("Invalid ID",400);
        const Feedack  = await getCommentreportsService(id);
        if(comments ===undefined){
            return C.text("No Leader found with this ID", 404);
        }
     return C.json(comments,200) 
}

export const createComments = async (C:Context)=>{
    try{
        const feedback_reports = await C.req.json();
        const newFeedbacks = await createCommentreportsService(feedback_reports);
        if(!createComments) return C.text("Leader not created", 400);
        return C.json({msg: newFeedbacks}, 201);
    }catch(error:any){
        return C.json({error:error.message}, 400)
    }
}

export const updateComments = async (C:Context)=>{
        const id = parseInt(C.req.param("id"));
        if (isNaN(id)) return C.text("Invalid ID",400);
        const feedback_reports = await C.req.json();
         try{ 
        const searchedComments = await getCommentreportsService(id);
        if(!searchedComments) return C.text("Leader not updated", 400);
        const res = await  updateCommentreportsService(id, feedback_reports);
        if(!res) return C.text("User not updates", 400);
        return C.json({msg: res}, 200);
    }catch(error:any){
        return C.json({error:error.message}, 400)
    }
}

export const deleteComments = async (C:Context)=>{
    const id = parseInt(C.req.param("id"));
    if (isNaN(id)) return C.text("Invalid ID",400);
    try{
        const searchedComment = await getCommentreportsService(id);
        if(!searchedComment) return C.text("Leader not found", 404);
        const res = await  deleteCommentreportsService (id);
        if(!res) return C.text("Leader not deleted", 400);
        return C.json({msg: res}, 200);
    }catch(error:any){
        return C.json({error:error.message}, 400)
    }
}