import { Context } from "hono";
import { registerUser, loginUser } from "./auth.Service";

export const register = async (C: Context)=> {
    try{
        const  user = await C.req.json();
        const response = await registerUser(user);
        return C.json({msg: response},201);
    }catch(error:any){
        return C.json({msg: error.message},400);
    }
}

export const login = async (C: Context) => {
    try{
        const { email, password } = await C.req.json();
        const response = await loginUser(email, password);
        return C.json({msg: response},200);
    }catch(error:any){
        return C.json({msg: error.message},400);
    }

}