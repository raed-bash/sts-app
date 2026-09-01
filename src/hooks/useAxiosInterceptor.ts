import { useCallback, useLayoutEffect } from "react";
import toast from "react-hot-toast";
import useLogout from "./useLogout";
import { api } from "src/app/axios";
import type { AxiosResponse } from "axios";

export default function useAxiosInterceptor() {
  const handleLogout = useLogout();

  const handleResponse = useCallback(
    (res: AxiosResponse) => {
      const status = res.status;
      const data = res.data;

      let message = null;

      if (status > 199 && status < 300) {
        if (message) {
          toast.success(message);
        }
      } else if (status > 399) {
        message = data.message;

        if (status === 401) {
          handleLogout();
        }

        if (!res.config.hideToasterMessage) {
          toast.error(message, {
            id: message,
          });
        }
      }
    },
    [handleLogout],
  );

  const handleErrNetwork = useCallback((err: any) => {
    if (err.message) {
      const message = err.message;

      toast.error(message);
    }
  }, []);

  useLayoutEffect(() => {
    const idResponse = api.interceptors.response.use(
      (res) => {
        handleResponse(res);

        return res;
      },
      (err: any) => {
        if (err.response) {
          handleResponse(err.response);
        }

        if (err.code === "ERR_NETWORK") {
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
