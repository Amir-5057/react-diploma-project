export const baseUrl = "http://161.35.153.209:5430/api";
export const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
export const jsonPlaceholderUrl = "https://jsonplaceholder.typicode.com";

console.log("PUBLISHABLE_KEY:", PUBLISHABLE_KEY);

if (!baseUrl) {
  throw new Error("Missing baseUrl");
}

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing PUBLISHABLE_KEY");
}
