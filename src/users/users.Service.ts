
import {TIUsers, TSUsers, users} from "../drizzle/schema"
import { sendMail } from "../nodemailer/mails"; // Import the sendMail utility
import db from "../drizzle/db"; // Import your database instance
import { eq } from "drizzle-orm";
import crypto from "crypto";


export const UsersService = async (limit?:number):Promise<TSUsers []| null> =>{
    if(limit){
        return await db.query.users.findMany({
            limit:limit
        })
    }
    return await db.query.users.findMany();
}

export const getUsersService = async (id:number):Promise<TIUsers| undefined> =>{
    return await db.query.users.findFirst({
        where:
            eq(users.id, id)
       })
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