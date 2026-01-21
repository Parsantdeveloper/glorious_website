import { betterAuth } from "better-auth";
import { Pool } from "pg";
import dotenv from "dotenv"
dotenv.config()
export const auth = betterAuth({
database: new Pool({
    connectionString:process.env.DATABASE_URL as string ,
    
  }),
   trustedOrigins: [
    "http://localhost:3000", // Next.js frontend
    "http://localhost:4000", // Express backend (safe to include)
  ],
  socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
    emailAndPassword: {    
        enabled: true
    } 
}); 