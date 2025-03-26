import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import {TILeadcomm, TSLeadcomm, leader_communications} from "../drizzle/schema"

export const listLeadearscommuneService = async (limit?:number):Promise<TSLeadcomm []|null>=>{
    if (limit){
        return await db.query.leader_communications.findMany({
            limit:limit
        })
        
    }
    return await db.query.leader_communications.findMany();
}

export const getLeaderscommuneService = async (id:number):Promise<TILeadcomm |undefined> =>{
    return await db.query.leader_communications.findFirst({
        where :(leader_communications)=>eq(leader_communications.id, id)
    })
};

export const createLeaderscommuneService = async (leader_communication:TILeadcomm) =>{
    await db.insert(leader_communications).values(leader_communication)
    return "Communication updated"
} 

export const updateLeaderscommuneService =async (id :number ,leader_communication:TILeadcomm)=>{
    await db.update(leader_communications).set(leader_communication).where(eq(leader_communications.id, id))
    return "Communication updated successfully"
}

export const  deleteLeaderscommuneService = async (id: number) =>{
    await db.delete (leader_communications).where(eq(leader_communications.id, id))
    return "Communication updated successfully"
}