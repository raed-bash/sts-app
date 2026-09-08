import axios from "axios";
import { LocalStorageHelper } from "@/shared/utils";
import { env } from "@/config/env";

const API_URL = env.API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${LocalStorageHelper.getItem("token") || ""}`,
  },
});

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.Authorization;
  }
}
