import axios from "axios";
import { LocalStorageHelper } from "src/utils/LocalStorageHelper";

const API_URL = "http://localhost:3000";

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
