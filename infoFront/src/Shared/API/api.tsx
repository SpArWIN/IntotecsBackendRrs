import axios from "axios";

export const localapi = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});
