import  {Context} from "hono";
import {leader_communications} from "../drizzle/schema"
import { getLeaderscommuneService, createLeaderscommuneService,deleteLeaderscommuneService, updateLeaderscommuneService,listLeadearscommuneService } from "./leadercommunications.Service";

export const listLeadearscommune = async (C:Context)=>{
    try {
        const limit = Number(C.req.query("limit"));
        const data = await listLeadearscommuneService(limit);
        if(data === null|| data.length == 0){
            return C.text("No communication found");
        }
        return C.json(data);
    }catch(error:any){
        return C.text(`Error: ${error.message}`, 400);
    }

}

export const getLeaderscommune = async (C:Context)=>{
    const id = parseInt(C.req.param("id"));
    if(isNaN(id))return C.text("Invalid ID", 400);
    const leadercommunications = await getLeaderscommuneService(id);
    if(leadercommunications=== undefined){
        return C.text("Communication not found", 404);
    }
        return C.json(leader_communications,200);
}

export const createLeaderscommune = async (C:Context)=>{
    try{
        const leadercommunications = await C.req.json();
        const newleadercommunications = await createLeaderscommuneService(leadercommunications);
        if(!createLeaderscommune) 
            return C.text("Leader not created", 400)
        return C.json({msg:newleadercommunications},201); 
    }catch(error:any){
        return C.text(`Error: ${error.message}`, 400);
}
}
export const updateLeaderscommune = async (C:Context)=>{
    const id = parseInt (C.req.param("id"));
    if(isNaN(id)) return C.text("Invalid ID", 400);
    const leadercommunications = await C.req.json();
    try{
        const searchedCommunications = await getLeaderscommuneService(id);
        if(!searchedCommunications) return C.text("Communication not updated", 400);
        const res = await updateLeaderscommuneService(id, leadercommunications);
        if(!res) return C.text("Communication not updated", 400)
            return C.json({msg:res}, 200);
    }catch(error:any){
        return C.json({error:error.message}, 400)
    }
}

export const deleteLeaderscommune = async (C:Context)=>{
    const id = parseInt(C.req.param("id"));
    if(isNaN(id)) return C.text("Invalid ID", 400);
    try{
        const searchedCommunications = await getLeaderscommuneService(id);
        if(!searchedCommunications) return C.text("Communication not deleted", 400);
        const res = await deleteLeaderscommuneService(id);
        if(!res) return C.text("Communication not deleted", 400)
        return C.json({msg:res}, 200);
    }catch(error:any){
        return C.json({error:error.message}, 400)
    }
}