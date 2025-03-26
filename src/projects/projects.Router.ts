import { Hono } from "hono";
import {createProjects, listProjects, updateProjects, deleteProjects,getProjects} from  "../projects/projects.Controller"
export const  projectsRouter = new Hono;

projectsRouter.get("/projects/:id", getProjects);

projectsRouter.post("/projects", createProjects);

projectsRouter.put("/projects/:id", updateProjects);

projectsRouter.delete("/projects/:id", deleteProjects);

projectsRouter.get("/projects", listProjects);
 