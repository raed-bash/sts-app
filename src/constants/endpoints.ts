export type ENDPOINTS = "login" | "users" | "auth" | "sign-up" | "me";

export const ep = (...endpoints: ENDPOINTS[]) => endpoints.join("/").toString();
