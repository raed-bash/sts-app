import "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    hideToasterMessage?: boolean;
  }
}
