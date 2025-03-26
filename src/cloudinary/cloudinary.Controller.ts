import { Context } from "hono";
import cloudinary from "./cloudinary";
import db from "../drizzle/db"; // Drizzle ORM instance
import { users, leaders, government_projects } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const uploadImage = async (c: Context) => {
  try {
    // Parse form data
    const formData = await c.req.formData();
    const userId = formData.get("userId") as string;
    const leaderId = formData.get("leaderId") as string;
    const projectId = formData.get("projectId") as string;

    // Get file from form-data
    const file = formData.get("image") as File;
    // Check if file exists and is not empty
    console.log(file);
    if (!file) {
      return c.json({ message: "No file uploaded" }, 400);
    }


    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64Image = `data:${file.type};base64,${Buffer.from(buffer).toString("base64")}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64Image, {
      upload_preset: "z4b5i0hc", // 🔥 Use Cloudinary upload preset
      folder: "uploads",
    });

    let updatedRecord;
    if (userId) {
      updatedRecord = await db.update(users)
        .set({ profile_photo: result.secure_url })
        .where(eq(users.id, parseInt(userId)))
        .returning();
    } else if (leaderId) {
      updatedRecord = await db.update(leaders)
        .set({ photo_url: result.secure_url })
        .where(eq(leaders.id, parseInt(leaderId)))
        .returning();
    } else if (projectId) {
      updatedRecord = await db.update(government_projects)
        .set({ media_url: result.secure_url })
        .where(eq(government_projects.id, parseInt(projectId)))
        .returning();
    } else {
      return c.json({ message: "No valid ID provided" }, 400);
    }

    return c.json({
      message: "Upload successful",
      url: result.secure_url,
      updatedRecord,
    });
  } catch (error:any) {
    console.error(error);
    return c.json({ message: "Upload failed", error: error.message }, 500);
  }
};
