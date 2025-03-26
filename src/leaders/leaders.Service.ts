import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TILeaders, TSLeaders, leaders } from "../drizzle/schema";


export const LeadersService = async (limit?:number):Promise<TSLeaders []|null> =>{
    if (limit){
        return await db.query.leaders.findMany({
            limit:limit
        })
    }
            return await db.query.leaders.findMany(); 
}

export const getLeadersService = async (id: number): Promise<TILeaders | undefined> => {
    return await db.query.leaders.findFirst({
        where: (row) => eq(row.id, id)
    });
};


export const createLeadersService = async (leader: TILeaders) => {
    await db.insert(leaders).values(leader)
    return "User created successful"
}

export const updateLeadersService = async (id: number, leader: TILeaders)=> {
    await db.update(leaders).set(leader).where(eq(leaders.id, id))
    return "User updated successful"
}

export const deleteLeadersService = async (id: number) => {
    await db.delete(leaders).where(eq(leaders.id, id))
    return "User deleted successful"
}