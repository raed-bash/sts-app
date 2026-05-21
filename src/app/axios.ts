import axios from "axios";
import { LocalStorageHelper } from "src/utils/LocalStorageHelper";

const API_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${LocalStorageHelper.getItem("token") || ""}`,
  },
});

export { api };
