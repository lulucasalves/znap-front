import axios, { AxiosInstance } from "axios";

export const app: AxiosInstance = axios.create({
  baseURL: "http://localhost:8080",
});
