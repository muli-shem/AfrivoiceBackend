import db from "../drizzle/db";
import { eq } from "drizzle-orm";
import {TSProjects, TIProjects ,government_projects } from "../drizzle/schema" 

export const ListProjectsServices = async (limit?:number): Promise<TSProjects []| null > =>{
    if (limit){
    return await db.query.government_projects.findMany({
        limit:limit
    })
    }
    return await db.query.government_projects.findMany()
} 

export const getProjectsService = async (id:number): Promise<TIProjects | undefined> =>{
    return await db.query.government_projects.findFirst({
        where: (government_projects)=> eq (government_projects.id, id)
    })
}

export const createProjectsService = async(governmentprojects:TIProjects) =>{
    await db.insert(government_projects).values(governmentprojects) 
    return "Projects Created Successfully"
}

export const updateProjectsService = async(id:number, governmentprojects: TIProjects)=>{
    await db.update(government_projects).set(governmentprojects).where(eq(government_projects.id,id))
    return "Projects Updated"
}

export const deleteProjectsService = async (id:number)=>{
    await db.delete(government_projects).where(eq(government_projects.id, id))
    return "Projects Deleted"
}