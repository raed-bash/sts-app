export type ENDPOINTS = "login" | "users" | "auth";

export const ep = (...endpoints: ENDPOINTS[]) => endpoints.join("/").toString();
