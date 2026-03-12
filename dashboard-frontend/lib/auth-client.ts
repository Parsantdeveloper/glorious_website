import { createAuthClient } from "better-auth/react"

const authBaseUrl = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '')
    : "http://localhost:4000"

export const authClient = createAuthClient({
        /** The base URL of the server (optional if you're using the same domain) */
        baseURL: authBaseUrl
})