import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useApiInterceptor } from "./useApiInterceptor";

type ResponseFulfilled = (res: unknown) => unknown;
type ResponseRejected = (err: unknown) => Promise<never>;
type RequestFulfilled = (config: unknown) => unknown;

type ResponseUse = (
  fulfilled: ResponseFulfilled,
  rejected?: ResponseRejected,
) => number;

type RequestUse = (fulfilled: RequestFulfilled) => number;

const mocks = vi.hoisted(() => ({
  logout: vi.fn(),
  toastError: vi.fn(),
  responseUse: vi.fn<ResponseUse>(() => 1),
  responseEject: vi.fn(),
  requestUse: vi.fn<RequestUse>(() => 1),
  requestEject: vi.fn(),
}));

vi.mock("@/lib/api", () => ({
  api: {
    interceptors: {
      response: { use: mocks.responseUse, eject: mocks.responseEject },
      request: { use: mocks.requestUse, eject: mocks.requestEject },
    },
  },
}));
vi.mock("@/shared/lib/toast", () => ({ default: { error: mocks.toastError } }));
vi.mock("./useLogout", () => ({ useLogout: () => mocks.logout }));

function responseFulfilled(): ResponseFulfilled {
  return mocks.responseUse.mock.calls[0][0];
}

function responseRejected(): ResponseRejected {
  return mocks.responseUse.mock.calls[0][1]!;
}

describe("useApiInterceptor", () => {
  it("logs out and toasts on 401 responses", () => {
    renderHook(() => useApiInterceptor());

    const fulfilled = responseFulfilled();

    const res = fulfilled({
      status: 401,
      data: { message: "Session expired" },
      config: {},
    }) as { status: number };

    expect(mocks.logout).toHaveBeenCalled();
    expect(mocks.toastError).toHaveBeenCalledWith("Session expired", {
      id: "Session expired",
    });
    expect(res.status).toBe(401);
  });

  it("toasts server errors without logging out", () => {
    renderHook(() => useApiInterceptor());

    responseFulfilled()({ status: 500, data: { message: "Boom" }, config: {} });

    expect(mocks.logout).not.toHaveBeenCalled();
    expect(mocks.toastError).toHaveBeenCalledWith("Boom", expect.anything());
  });

  it("does nothing for successful responses", () => {
    renderHook(() => useApiInterceptor());

    responseFulfilled()({ status: 200, data: {}, config: {} });

    expect(mocks.logout).not.toHaveBeenCalled();
    expect(mocks.toastError).not.toHaveBeenCalled();
  });

  it("skips the toast when the config hides it", () => {
    renderHook(() => useApiInterceptor());

    responseFulfilled()({
      status: 400,
      data: { message: "Nope" },
      config: { hideToasterMessage: true },
    });

    expect(mocks.toastError).not.toHaveBeenCalled();
  });

  it("handles rejected responses and the network error case", async () => {
    renderHook(() => useApiInterceptor());

    const rejected = responseRejected();

    const withResponse = {
      response: { status: 400, data: { message: "Bad" }, config: {} },
      code: "",
      message: "",
    };

    await expect(rejected(withResponse)).rejects.toEqual(withResponse);
    expect(withResponse.message).toBe("Bad");
    expect(mocks.toastError).toHaveBeenCalledWith("Bad", expect.anything());

    const network = { response: null, code: "ERR_NETWORK", message: "offline" };

    await expect(rejected(network)).rejects.toEqual(network);
    expect(mocks.toastError).toHaveBeenCalledWith("offline");
  });

  it("drops empty string request params", () => {
    renderHook(() => useApiInterceptor());

    const requestFulfilled: RequestFulfilled =
      mocks.requestUse.mock.calls[0][0];

    const config = requestFulfilled({ params: { title: "", page: 2 } }) as {
      params: { title: string; page: number };
    };

    expect(config.params).toEqual({ title: undefined, page: 2 });
  });

  it("ejects the interceptors on unmount", () => {
    const { unmount } = renderHook(() => useApiInterceptor());

    unmount();

    expect(mocks.responseEject).toHaveBeenCalled();
    expect(mocks.requestEject).toHaveBeenCalled();
  });
});
