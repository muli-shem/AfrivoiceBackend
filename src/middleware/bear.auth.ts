import "dontenv/config"; // 
import {verify} from "hono/jwt";
import { Context, Next } from "hono";

interface HonoRequest<T, U>{
    user?: T;

}
// AUTHENTICATION MIDDLEWARE
// Function to verify a JWT token using a secret
export const verifyToken = async (token:string, secret:string)=>{
    try {
        const decoded = await verify(token as string, secret);
        return decoded;
    }catch(error:any){
        return null;
    }
}
// Function to check authorization based on the required role
export const authMiddleware = async (c:Context &{req:HonoRequest<any, unknown>},next:Next, requiredRole:string)=>{
    const token = c.req.header("Authorization");
    if (!token) return c.json({error:"Token is required"}, 401);
    const decoded = await verifyToken(token as string, process.env.SECRET as string);
    if (!decoded) return c.json({error: "Invalid token"}, 401);
    if(requiredRole ==="admin"){
        if(decoded.role ==="citizen"|| decoded.role ==="leader"){
            c.req.user = decoded;
        return next();
}
   } else if(decoded.role=== requiredRole){
    c.req.user = decoded;
    return next();
   }
   return c.json({error: "Unauthorized"}, 401);
}

// Middleware for admin role authorization
// Calls authMiddleware with "admin" as the required role
export const adminAuthMiddleware = async (c:Context , next:Next) => await authMiddleware(c, next, "admin");

// Middleware for user role authorization
// Calls authMiddleware with "citizen" as the required role

export const citizenAuthMiddleware = async(c:Context, next:Next)=> await authMiddleware(c,next,"citizen" );


// Middleware for both admin and user role authorization
// Calls authMiddleware with "both" as the required role

export const leaderAuthMiddleware = async(c:Context, next:Next)=> await authMiddleware(c, next, "leader")