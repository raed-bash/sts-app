import { useCallback, useLayoutEffect } from "react";
import { AxiosError, type AxiosResponse } from "axios";
import toast from "@/shared/lib/toast";
import { api } from "@/lib/api";
import { useLogout } from "./useLogout";

export function useApiInterceptor() {
  const handleLogout = useLogout();

  const handleResponse = useCallback(
    (res: AxiosResponse) => {
      const status = res.status;

      if (status > 399) {
        const message = res.data?.message;

        if (status === 401) {
          handleLogout();
        }

        if (!res.config.hideToasterMessage && message) {
          toast.error(message, {
            id: message,
          });
        }
      }
    },
    [handleLogout],
  );

  const handleErrNetwork = useCallback((err: AxiosError) => {
    if (err.message) {
      toast.error(err.message);
    }
  }, []);

  useLayoutEffect(() => {
    const idResponse = api.interceptors.response.use(
      (res) => {
        handleResponse(res);

        return res;
      },
      (err: AxiosError<{ message?: string }>) => {
        if (err.response) {
          handleResponse(err.response);

          const apiMessage = err.response.data.message;

          if (apiMessage) {
            err.message = apiMessage;
          }
        }

        if (err.code === "ERR_NETWORK" || err.code === "ECONNABORTED") {
          handleErrNetwork(err);
        }

        return Promise.reject(err);
      },
    );

    const idRequest = api.interceptors.request.use(
      (config) => {
        if (config.params) {
          config.params = Object.fromEntries(
            Object.entries(config.params).map(([key, value]) => [
              key,
              value !== "" ? value : undefined,
            ]),
          );
        }

        return config;
      },
      (err) => {
        return Promise.reject(err);
      },
    );

    return () => {
      api.interceptors.response.eject(idResponse);
      api.interceptors.request.eject(idRequest);
    };
  }, [handleResponse, handleErrNetwork]);
}
