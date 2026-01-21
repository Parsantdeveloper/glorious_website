"use client"

import { Spotlight } from "@/components/ui/spotlight"
import { Button } from "@/components/ui/button"
import {authClient} from "@/lib/auth-client"
export default function LoginPage() {
  const handleGoogleLogin = async() => {
    console.log("button clicked")
   await authClient.signIn.social({
    /**
     * The social provider ID
     * @example "github", "google", "apple"
     */
    provider: "google",
    /**
     * A URL to redirect after the user authenticates with the provider
     * @default "/"
     */
    callbackURL: "/", 
    /**
     * A URL to redirect if an error occurs during the sign in process
     */
    errorCallbackURL: "/error",
    /**
     * A URL to redirect if the user is newly registered
     */
    newUserCallbackURL: "/welcome",
    /**
     * disable the automatic redirect to the provider. 
     * @default false
     */
    // disableRedirect: true,
});    
  }

  async function loginemail(){
const { data, error } = await authClient.signIn.email({
    email: "john.doe@gmail.com", // required
    password: "password1234", // required
    rememberMe: true,
});
  }

  return (
    <main className="relative min-h-screen w-full bg-white flex items-center justify-center overflow-hidden">
      <Spotlight className="from-blue-500 via-blue-400 to-blue-300" size={300} position={{ x: 0, y: 0 }} />
      <Spotlight className="from-purple-500 via-purple-400 to-purple-300" size={250} position={{ x: 800, y: 200 }} />

      {/* Logo in top left */}
      <div className="absolute top-8 left-8 z-20 w-5/6 max-w-xs">
        <h2 className="text-3xl font-bold text-gray-900">Glorious</h2>
      </div>

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-8 px-4">
        {/* Logo or title */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to Glorious.com</h1>
          <p className="text-gray-600 text-lg">Sign in to your account</p>
        </div>

        {/* Google login button */}
        <Button
          onClick={handleGoogleLogin}
          className="px-12 py-8 text-xl w-[500px] cursor-pointer font-semibold bg-white border-2 border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 rounded-lg flex items-center justify-center gap-4"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Login with Google
        </Button>

        {/* Footer text */}
        <p className="text-sm text-gray-500 text-center mt-4">
          Happy Shopping!!
        </p>

        <Button onClick={loginemail}>login</Button>
      </div>
    </main>
  )
}