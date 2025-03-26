import { Context } from "hono";
import { ListProjectsServices, createProjectsService, getProjectsService, updateProjectsService, deleteProjectsService } from "./projects.service";
import {government_projects} from "../drizzle/schema"

export const listProjects = async (C: Context) => {
    try{
        const limit = Number(C.req.query("limit"));
        const data = await ListProjectsServices(limit);
        if(data === null || data.length == 0){
            return C.text( "No projects found");
        }
        return C.json(data);
    }catch(error:any){
        return C.json({error}, 400);
    }
}

export const getProjects = async (C:Context)=>{
    const id = parseInt(C.req.param("id"));
    if(isNaN(id)) return C.text("Invalid id", 400);
        const Projects = await getProjectsService(id);
        if(Projects ===undefined){
            return C.text("Project not found", 404);
        }
        return C.json(government_projects, 200)
}

export const createProjects = async (C: Context) => {
    try{
        const Projects = await C.req.json();
        const newProjects = createProjectsService(Projects);
        if(!newProjects) return C.text("Projects not created");
        return C.json({msg: newProjects}, 201);
    }catch(error:any){
        return C.json({error:error.message}, 400)
    }
}

export const updateProjects = async(C: Context) =>{
    const id = parseInt(C.req.param ("id"));
    if(isNaN(id))return C.text("Invalid id", 400);
    const Projects = await  C.req.json();
    try{
        const searchedProjects = await getProjectsService(id);
        if(searchedProjects === undefined) return C.text("Project not found", 404);
        const res = await updateProjectsService(id, Projects);
        if(!res) return C.text("Project not updated", 400)
            return C.json({msg:res}, 200);
}catch(error:any){
    return C.json({error:error.message},400)
}
}

export const deleteProjects = async (C:Context)=>{
    const id = parseInt(C.req.param("id"));
    if((isNaN(id))) return C.text("Invalid ID", 400);
    try{
        const searchedProjects = await getProjectsService(id)
        if(!searchedProjects) return C.text("Project not found", 404);
        const res = await deleteProjectsService(id);
        return C.json({msg:res}, 200)

    }catch(error:any){
        return C.json({error:error.message}, 400)
    }
}
    