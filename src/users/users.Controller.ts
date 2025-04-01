import { Context } from "hono";
import { UsersService,cretaeUsersService,getUsersService ,updateUsersService, deleteUsersService,resetPassword, updatePassword} from "./users.Service";
import { users } from "../drizzle/schema"; // Import the users table schema




export const listUsers =async (c:Context)=>{
    try{
        const limit = Number(c.req.query("limit"));
        const data = await UsersService(limit);
        if(data === null||data.length ==0){
            return c.text("user not found");
        }
      return c.json(data);      
    }catch (error:any ){
    return c.json({error}, 400);
} 
}
export const getUsers = async(c:Context) =>{
    const user_id = parseInt(c.req.param("id"));
    if(isNaN(user_id)) return c.text("Invalid ID", 400);
    
    const users = await getUsersService(user_id);
    if(users === undefined){
        return c.text("User not found", 404);
    }
    
    return c.json(users, 200);
}



export const createUsers = async (c:Context) =>  {
    try{
        const Users= await c.req.json();
        const createUsers = await cretaeUsersService(Users);
        if(!createUsers) return c.text("User not created", 400);
        return c.json({msg: createUsers},201);
    }catch (error:any){
        return c.json({error:error.message},400);
    }

}

export const updateUsers = async (c: Context) =>{
    const id = parseInt(c.req.param("id"));
    if(isNaN(id)) return c.text("Invalid ID", 400);
    const Users = await c.req.json();
    try{
        const searchedUser = await getUsersService(id)
        if(searchedUser == undefined) return c.text("User not found" ,400);
        const res = await updateUsersService(id, Users);
        if (!res) return c.text ("User not updates", 400);
        return c.json({msg: res},200);
    }catch (error:any){
        return c.json({error: error?.message}, 400)
    }
}

export const deleteUser = async(c:Context) =>{
    const id= parseInt(c.req.param("id"));
    if(isNaN(id)) return c.text("Invalid ID", 400);
    try{
    const searchedUser = await getUsersService(id)
    if(searchedUser == undefined) return c.text("User not found", 400);
    const res = await deleteUsersService(id);
    if(!res) return c.text ("User not updates" , 400);
    return c.json({msg: res}, 200); 
    }catch (error:any){
        return c.json({error: error?.message}, 400)
    }
}

export const resetPasswordController = async (ctx: Context) => {
    try {
        const { email } = await ctx.req.json(); // Parse JSON body to extract the email
        if (!email) {
            return ctx.json({ error: "Email is required" }, 400); // Return error if email is missing
        }

        const result = await resetPassword(email); // Call the service function
        return ctx.json({ message: result }, 200); // Return success response
    } catch (error: any) {
        console.error(error);
        return ctx.json({ error: error.message || "An error occurred" }, 500); // Return error response
    }
};
export const updatePasswordController = async (ctx: Context) => {
    try {
      const { token, password } = await ctx.req.json();
      if (!token || !password) {
        return ctx.json({ error: "Token and password are required" }, 400);
      }
  
      const result = await updatePassword(token, password);
      return ctx.json({ message: result }, 200);
    } catch (error: any) {
      console.error(error);
      return ctx.json({ error: error.message || "An error occurred" }, 500);
    }
  };