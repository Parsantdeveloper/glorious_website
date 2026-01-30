import axios from "axios";

// Create an Axios instance
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Your API base URL
  withCredentials: true,                     // Include cookies automatically
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Interceptors for request or response
// You can log errors globally or handle auth expiration
api.interceptors.response.use(
  (response) => response, // pass successful response
  (error) => {
    console.error("API error:", error.response?.data || error.message);
    return Promise.reject(error); // reject to handle in component
  }
);
