import "dotenv/config"

import { defineConfig} from 'drizzle-kit';
import { drizzle } from "drizzle-orm/better-sqlite3";

export default defineConfig({
    schema: "./src/drizzle/schema.ts",
    out:"./src/drizzle/migrations",
    dialect: 'postgresql',
    dbCredentials:{
        url:process.env.Database_url as string,
    },
    verbose: true,
    strict: true,
});