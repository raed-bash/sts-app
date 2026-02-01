export type ENDPOINTS = "login" | "users" | "auth" | "sign-up";

export const ep = (...endpoints: ENDPOINTS[]) => endpoints.join("/").toString();
