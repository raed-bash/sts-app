import { useCallback, useLayoutEffect } from "react";
import toast from "@/shared/lib/toast";
import { api } from "@/lib/api";
import type { AxiosResponse } from "axios";
import { useLogout } from "./useLogout";
import { useQueryClient } from "@tanstack/react-query";
import { testSessionsQueryKeys } from "@/features/test-sessions/test-sessions.api-keys";

export function useApiInterceptor() {
  const handleLogout = useLogout();
  const queryClient = useQueryClient();

  const handleResponse = useCallback(
    (res: AxiosResponse) => {
      const status = res.status;

      if (status > 399) {
        const message = res.data?.message;

        if (status === 401) {
          handleLogout();
        }

        // Exam in progress: not an error for the user — ActiveExamRedirect takes them back.
        if (res.data?.code === "TEST_IN_PROGRESS") {
          queryClient.invalidateQueries({
            queryKey: testSessionsQueryKeys.checkStudentTestSessions(),
          });
          return;
        }

        if (!res.config.hideToasterMessage && message) {
          toast.error(message, {
            id: message,
          });
        }
      }
    },
    [handleLogout, queryClient],
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
      (err) => {
        if (err.response) {
          handleResponse(err.response);

          const apiMessage = err.response.data.message;

          err.message = apiMessage;
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
