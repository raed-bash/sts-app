import { useCallback, useLayoutEffect } from "react";
import toast from "react-hot-toast";
import useLogout from "./useLogout";
import { axiosInstance } from "src/app/axios";
import type { AxiosResponse } from "axios";

export default function useAxiosInterceptor() {
  const handleLogout = useLogout();

  const handleResponse = useCallback(
    (res: AxiosResponse<any, any, {}>) => {
      const status = res.status;
      const data = res.data;

      let message = null;

      if (status > 199 && status < 300) {
        if (status === 200) {
          message = data.result;
        }

        if (message) {
          toast.success(message);
        }
      } else if (status > 399) {
        if (status === 400) {
          message = data.non_field_errors || data.detail;
        }

        if (status === 401) {
          const messages = data.messages;

          message = messages?.[0].message;

          handleLogout();
        }

        if (status === 403) {
          message = `${res.config.url}:
           ${data.detail}`;
        }
        if (status === 404) {
          message = `${data.detail}`;
        }

        toast.error(message);
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
    const idResponse = axiosInstance.interceptors.response.use(
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

    return () => {
      axiosInstance.interceptors.response.eject(idResponse);
    };
  }, [handleResponse, handleErrNetwork]);
}
