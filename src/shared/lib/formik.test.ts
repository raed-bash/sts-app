import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { z } from "zod";
import { useAppFormik } from "./formik";

describe("useAppFormik", () => {
  it("surfaces zod errors for touched invalid fields", async () => {
    const { result } = renderHook(() =>
      useAppFormik<{ title: string }>({
        initialValues: { title: "ab" },
        validationZodSchema: z.object({ title: z.string().min(3) }),
        onSubmit: vi.fn(),
      }),
    );

    await act(async () => {
      result.current.setFieldTouched("title", true);
    });

    expect(result.current.touchedErrors.title).toBeDefined();
  });

  it("keeps valid touched fields free of errors", async () => {
    const { result } = renderHook(() =>
      useAppFormik<{ title: string }>({
        initialValues: { title: "long enough" },
        validationZodSchema: z.object({ title: z.string().min(3) }),
        onSubmit: vi.fn(),
      }),
    );

    await act(async () => {
      result.current.setFieldTouched("title", true);
    });

    expect(result.current.touchedErrors.title).toBeUndefined();
  });

  it("skips validation when no schema is provided", async () => {
    const { result } = renderHook(() =>
      useAppFormik<{ title: string }>({
        initialValues: { title: "" },
        onSubmit: vi.fn(),
      }),
    );

    await act(async () => {
      result.current.setFieldTouched("title", true);
    });

    expect(result.current.touchedErrors).toEqual({});
  });
});
