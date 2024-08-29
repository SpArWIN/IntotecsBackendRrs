import axios from "axios";

export const localapi = axios.create({
  baseURL: "/",
  headers: { "Content-Type": "application/json" },
});
