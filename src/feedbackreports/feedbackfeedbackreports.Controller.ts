import { Context } from "hono";
import { listFeedbackreportsService,createFeedbackreportsService, getFeedbackreportsService, updateFeedbackreportsService,  deleteFeedbackreportsService  } from "./feedbackreports.Service";
import { feedback_reports } from "../drizzle/schema";



export const listFeebacks = async (C:Context)=>{
    try{
        const limit = Number(C.req.query("limit"));
        const data = await listFeedbackreportsService(limit);
        if(data ===null|| data.length==0){
            return C.text("No feedback_reports found");
        }
        return C.json(data);
    }catch(error:any){
        return C.json({error}, 400)
    }  
}

export const getFeedbacks = async (C:Context)=>{
    
        const id = parseInt(C.req.param("id"));
        if (isNaN(id))return C.text("Invalid ID",400);
        const Feedack  = await getFeedbackreportsService(id);
        if(feedback_reports ===undefined){
            return C.text("No Leader found with this ID", 404);
        }
     return C.json(feedback_reports,200) 
}

export const createFeedbacks = async (C:Context)=>{
    try{
        const feedback_reports = await C.req.json();
        const newFeedbacks = await createFeedbackreportsService(feedback_reports);
        if(!createFeedbacks) return C.text("Leader not created", 400);
        return C.json({msg: newFeedbacks}, 201);
    }catch(error:any){
        return C.json({error:error.message}, 400)
    }
}

export const updateFeedbacks = async (C:Context)=>{
        const id = parseInt(C.req.param("id"));
        if (isNaN(id)) return C.text("Invalid ID",400);
        const feedback_reports = await C.req.json();
         try{ 
        const searchedFeedbacks = await getFeedbackreportsService(id);
        if(!searchedFeedbacks) return C.text("Leader not updated", 400);
        const res = await  updateFeedbackreportsService(id, feedback_reports);
        if(!res) return C.text("User not updates", 400);
        return C.json({msg: res}, 200);
    }catch(error:any){
        return C.json({error:error.message}, 400)
    }
}

export const deleteFeedbacks = async (C:Context)=>{
    const id = parseInt(C.req.param("id"));
    if (isNaN(id)) return C.text("Invalid ID",400);
    try{
        const searchedFeedack = await getFeedbackreportsService(id);
        if(!searchedFeedack) return C.text("Leader not found", 404);
        const res = await  deleteFeedbackreportsService (id);
        if(!res) return C.text("Leader not deleted", 400);
        return C.json({msg: res}, 200);
    }catch(error:any){
        return C.json({error:error.message}, 400)
    }
}