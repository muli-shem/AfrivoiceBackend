
import {TIUsers, TSUsers, users} from "../drizzle/schema"
import { sendMail } from "../nodemailer/mails"; // Import the sendMail utility
import db from "../drizzle/db"; // Import your database instance
import { eq } from "drizzle-orm";
import crypto from "crypto";
import bcrypt from "bcrypt";


export const UsersService = async (limit?:number):Promise<TSUsers []| null> =>{
    if(limit){
        return await db.query.users.findMany({
            limit:limit
        })
    }
    return await db.query.users.findMany();
}

export const getUsersService = async (user_id: number) => {
    // Fetch user, but explicitly select only the fields you want
    const user = await db.select({
        id: users.id,
        username: users.username,
        email: users.email,
        profilePhoto: users.profile_photo,
        county: users.county,
        subCounty: users.sub_county,
        ward: users.ward,
        // Exclude sensitive fields like password_hash
    }).from(users)
    .where(eq(users.id, user_id))
    .execute().then(results => results[0]);

    return user;
}

export const cretaeUsersService = async(Users:TIUsers)=>{
    await db.insert(users).values(Users)
    return "User created successfully"
}
export const updateUsersService =async (id:number, Users:TIUsers) =>{
    await db.update(users).set(Users).where(eq(users.id, id))
    return "User updated successfully" 
}

export const deleteUsersService = async (id:number) =>{
    await db.delete(users).where(eq(users.id, id))
    return "User deleted successfully"
}
export const resetPassword = async (email: string) => {
    // Check if the user exists in the database
    const existingUser = await db.select().from(users).where(eq(users.email, email)).execute();
    if (existingUser.length === 0) {
        throw new Error("User with that email does not exist");
    }

    // Generate a password reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save the token and its expiration to the database (or temporary storage)
    const resetTokenExpiration = new Date(Date.now() + 3600000); // Token valid for 1 hour
    await db.update(users)
        .set({ reset_token: resetToken, reset_token_expiration: resetTokenExpiration })
        .where(eq(users.email, email))
        .execute();

    // Construct the reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Send the email
    const subject = "Password Reset Request";
    const html = `
        <p>Hello,</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>If you did not request this, please ignore this email.</p>
    `;

    await sendMail(process.env.MAIL_USERNAME!, email, subject, html);
    return "Password reset email sent successfully";
};
export const updatePassword = async (token: string, password: string) => {
    // Find the user with this reset token
    const existingUser = await db.select().from(users).where(eq(users.reset_token, token)).execute();
    
    if (existingUser.length === 0) {
      throw new Error("Invalid or expired reset token");
    }
    
    const user = existingUser[0];
    
    // Check if token is expired
    if (!user.reset_token_expiration || user.reset_token_expiration < new Date()) {
      throw new Error("Reset token has expired");
    }
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Update user with new password and clear reset token fields
    await db.update(users)
      .set({
        password_hash: hashedPassword,
        reset_token: null,
        reset_token_expiration: null
      })
      .where(eq(users.id, user.id))
      .execute();
    
    return "Password has been reset successfully";
  };