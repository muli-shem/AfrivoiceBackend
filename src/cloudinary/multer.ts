import multer from "multer";

const storage = multer.memoryStorage(); // Store in memory (no local storage)
const upload = multer({ storage });

export const uploadMiddleware = upload.single("image"); // Hono Middleware
