import { z } from "zod";

// Define the user schema
export const userValidator = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(50, { message: "Username cannot exceed 50 characters." }),
  email: z
    .string()
    .email({ message: "Invalid email address." })
    .max(100, { message: "Email cannot exceed 100 characters." }),
  password_hash: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(256, { message: "Password cannot exceed 256 characters." }),
  county: z
    .string()
    .min(2, { message: "County must be at least 2 characters long." })
    .max(50, { message: "County cannot exceed 50 characters." }),
  sub_county: z
    .string()
    .min(2, { message: "Sub-county must be at least 2 characters long." })
    .max(50, { message: "Sub-county cannot exceed 50 characters." }),
  ward: z
    .string()
    .min(2, { message: "Ward must be at least 2 characters long." })
    .max(50, { message: "Ward cannot exceed 50 characters." }),
  role: z
    .string()
    .optional()
    .default("citizen")
    .refine(
      (role) => ["citizen", "leader", "admin"].includes(role),
      { message: "Role must be either 'user', 'leader', or 'admin'." }
    ),
});
export const authValidator = z.object({
    role: z
    .string()
    .min(3, { message: "Role must be at least 3 characters long." })
    .max(50, { message: "Role cannot exceed 50 characters." })
    .refine((role) => ["citizen", "leader", "admin"].includes(role), {
      message: "Role must be one of 'user', 'leader', or 'admin'.",
    }),
})
export const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().max(255),
})
