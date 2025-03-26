import bcrypt from "bcryptjs"; // Importing bcryptjs for password hashing and comparison
import jwt from "jsonwebtoken"; // Importing jsonwebtoken for creating and verifying JWT tokens
import  db  from "../drizzle/db"; // Importing the database instance
import { users , auth_table } from "../drizzle/schema"; // Importing the Users and Authentication table schemas
import { eq } from "drizzle-orm";
import { authValidator, loginSchema, userValidator } from "../validator";
import { sendMail } from "../nodemailer/mails"; // Importing the sendMail function from the mail utility

const secret = process.env.SECRET;
const expiresIn = process.env.EXPIRESIN;

export const registerUser = async(user:any)=>{
    userValidator.parse(user); //Validating the user object against the schema 
    authValidator.parse(user); // validating the authentcation object against the schema

    const existingUser = await db.select().from(users).where(eq(users.email, user.email)).execute(); //Checking if the user already exists
    if(existingUser.length > 0){
        throw new Error("User with that email already exists");
    }
    //Hashing the password
    const password_hash = bcrypt.hashSync(user.password_hash, 10);
    //Inserting into the users table
    const newUser = await db.insert(users).values({
        username: user.username,
        email: user.email,
        password_hash: password_hash,
        county: user.county,
        sub_county: user.sub_county,
        ward: user.ward,
        role: user.role,
    })
    .returning({id: users.id})
    .execute();
    //Inserting data into authentication table 
    const user_id = newUser[0].id;
    try{
        await db.insert(auth_table).values({ id:user_id, }).execute(); 
        //Send a welcome email to the user
        const from = 'non-reply@yourapp.com';
        const subject = 'Welcome to AfriVoice Hub';
        const html = `<p>Dear ${user.username},</p>
        <p>Welcome to AfriVoice Hub. We are excited to have you on board.</p>
        <p>Best regards,<br>AfriVoice Hub Team</p>`;

        await sendMail(from, user.email,  subject, html); // Sending the email
        return 'User registered successfully'; // Returning success message   
    }catch(error){
        //Rollback: Deleting the user from the Users table if the second insert fails
        await db.delete(users).where(eq(users.id,user_id)).execute();
        throw new Error("Failed to register user");
    }
}
// Service function to login in a user
export const loginUser = async(email:string, password: string)=>{
    loginSchema.parse({email, password}); //Validating the user object against the schema

    //Fetching the user by email from the Users table
    const Users = await db.select().from(users).where(eq(users.email, email)).execute();
    if(Users.length === 0){
        throw new Error("User not found");
        }
        const user = Users[0];
        
    // Fetching the user's hashed password from the users table
     const logeduser = await db.select().from(users).where(eq(users.id, user.id)).execute();
     if (logeduser.length ===0){
            throw new Error("User not found");
     }
     const auth = logeduser[0];
     //Comparing the hashed password with the provided password
     const isValidPassword =await  bcrypt.compareSync(password, auth.password_hash);
     if(!isValidPassword){
        throw new Error('Invalid credentials! Try again'); 
     }  
     //Creating a JWT token
     const token = jwt.sign(
      {id:user.id, email:user.email, role:user.role},
      secret!, 
        {expiresIn} );
        //Send login notification email 
        const form ="no-reply@yourapp.com";
        const subject = "Login Notification";
        const html = `<p>Hi ${user.username},</p>
        <p>You just logged into your account. If this wasn't you, please change your password immediately.</p>
        <p>Best Regards,<br>AfriVoice Hub Team</p>`;

    await sendMail(form, user.email, subject, html); // Sending the email
     return {token, user};
    }
   // Service function to verify a JWT token
export const verifyToken = (token: string) => {
    try {
        if (!secret) {
            throw new Error('Secret is undefined'); // Throwing an error if the secret is undefined
        }
        return jwt.verify(token, secret); // Verifying the token with the secret
    } catch (error) {
        throw new Error('Invalid token'); // Throwing an error if the token is invalid
    }
}
