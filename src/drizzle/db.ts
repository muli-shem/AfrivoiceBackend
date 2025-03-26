import "dotenv/config";
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "./schema";


  const client = neon(process.env.Database_url as string);//

 const db = drizzle(client, { schema, logger:true})//create a drizzle instance

 export default db; //export the drizzle instance