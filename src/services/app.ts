import axios, { AxiosInstance } from "axios";

export const app: AxiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:8080"
      : "https://ill-lime-buffalo-tutu.cyclic.app",
});
