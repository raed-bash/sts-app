import "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    hideToasterMessage?: boolean;
  }

  export interface StrictSignalRequestConfig extends AxiosRequestConfig {
    signal: AbortSignal;
  }

  export interface AxiosInstance {
    get<T = any, R = AxiosResponse<T>>(
      url: string,
      config: StrictSignalRequestConfig,
    ): Promise<R>;
  }
}
