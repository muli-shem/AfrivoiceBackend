import { Hono } from "hono";
import { uploadImage } from "./cloudinary.Controller";

const router = new Hono();

router.post("/upload", uploadImage);

export default router;
