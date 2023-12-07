import axios, { AxiosInstance } from "axios";

export const app: AxiosInstance = axios.create({
  baseURL: "https://ill-lime-buffalo-tutu.cyclic.app",
});
