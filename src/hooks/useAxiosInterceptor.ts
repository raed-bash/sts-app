import { useCallback, useLayoutEffect } from "react";
import toast from "react-hot-toast";
import useLogout from "./useLogout";
import { axiosInstance } from "src/app/axios";

export default function useAxiosInterceptor() {
  const handleLogout = useLogout();

  const handleResponse = useCallback(
    (res) => {
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
    [handleLogout]
  );

  const handleErrNetwork = useCallback((err) => {
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
      (err) => {
        if (err.response) {
          handleResponse(err.response);
        }

        if (err.code === "ERR_NETWORK") {
          handleErrNetwork(err);
        }

        return Promise.reject(err);
      }
    );

    const idRequest = axiosInstance.interceptors.request.use(
      (config) => {
        config.baseURL =
          config.baseURL + `:${servicesPorts[config.url?.split("/")?.[0]]}`;
        return config;
      },
      (err) => Promise.reject(err)
    );

    return () => {
      axiosInstance.interceptors.response.eject(idResponse);
      axiosInstance.interceptors.request.eject(idRequest);
    };
  }, [handleResponse, handleErrNetwork]);
}

const servicesPorts = {
  account: 8000,
  general: 8001,
  shipment: 8002,
  family: 8003,
  foundation: 8004,
};
