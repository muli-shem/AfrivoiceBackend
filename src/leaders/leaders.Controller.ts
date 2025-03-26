import { Context } from "hono";
import { LeadersService, createLeadersService, getLeadersService, updateLeadersService, deleteLeadersService } from "./leaders.Service";
import { leaders } from "../drizzle/schema";



export const listLeadears = async (C:Context)=>{
    try{
        const limit = Number(C.req.query("limit"));
        const data = await LeadersService(limit);
        if(data ===null|| data.length==0){
            return C.text("No Leaders found");
        }
        return C.json(data);
    }catch(error:any){
        return C.json({error}, 400)
    }  
}

export const getLeaders = async (C:Context)=>{
    
        const id = parseInt(C.req.param("id"));
        if (isNaN(id))return C.text("Invalid ID",400);
        const Leaders  = await getLeadersService(id);
        if(Leaders ===undefined){
            return C.text("No Leader found with this ID", 404);
        }
     return C.json(leaders,200) 
}

export const createLeaders = async (C:Context)=>{
    try{
        const Leaders = await C.req.json();
        const newLeaders = await createLeadersService(Leaders);
        if(!createLeaders) return C.text("Leader not created", 400);
        return C.json({msg: newLeaders}, 201);
    }catch(error:any){
        return C.json({error:error.message}, 400)
    }
}

export const updateLeaders = async (C:Context)=>{
        const id = parseInt(C.req.param("id"));
        if (isNaN(id)) return C.text("Invalid ID",400);
        const Leaders = await C.req.json();
         try{ 
        const searchedLeaders = await getLeadersService(id);
        if(!searchedLeaders) return C.text("Leader not updated", 400);
        const res = await updateLeadersService(id, Leaders);
        if(!res) return C.text("User not updates", 400);
        return C.json({msg: res}, 200);
    }catch(error:any){
        return C.json({error:error.message}, 400)
    }
}

export const deleteLeaders = async (C:Context)=>{
    const id = parseInt(C.req.param("id"));
    if (isNaN(id)) return C.text("Invalid ID",400);
    try{
        const searchedLeaders = await getLeadersService(id);
        if(!searchedLeaders) return C.text("Leader not found", 404);
        const res = await deleteLeadersService(id);
        if(!res) return C.text("Leader not deleted", 400);
        return C.json({msg: res}, 200);
    }catch(error:any){
        return C.json({error:error.message}, 400)
    }
}