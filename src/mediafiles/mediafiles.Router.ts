import { Hono } from "hono";
import {ListMediafiles, getMediafiles, createMediafiles, deleteMediafiles, updateMediafiles} from "./mediafiles.Controller"

export const mediaFilesRouter = new Hono();

mediaFilesRouter.get("/mediafiles", ListMediafiles);
mediaFilesRouter.get("/mediafiles/:id", getMediafiles);
mediaFilesRouter.post("/mediafiles", createMediafiles);
mediaFilesRouter.delete("/mediafiles/:id", deleteMediafiles);
mediaFilesRouter.put("/mediafiles/:id", updateMediafiles);