import { describe, expect, it, vi } from "vitest";
import {
  convertSortsObjectToSortParams,
  convertStringParamsToObject,
  injectObjectParamsToGetDataApi,
} from "./params";

describe("params utils", () => {
  describe("convertStringParamsToObject", () => {
    it("parses key/value pairs and adopts values without keys", () => {
      expect(
        convertStringParamsToObject(
          "key1::value1,, key2::  value2,, value3",
          "key3",
        ),
      ).toEqual({ key1: "value1", key2: "value2", key3: "value3" });
    });

    it("adopts a value that has no key", () => {
      expect(convertStringParamsToObject("free text", "adopter")).toEqual({
        adopter: "free text",
      });
    });

    it("ignores empty trailing segments", () => {
      expect(convertStringParamsToObject("key::val,,", "adopter")).toEqual({
        key: "val",
      });
    });
  });

  describe("convertSortsObjectToSortParams", () => {
    it("produces a dotted string for sorts", () => {
      expect(
        convertSortsObjectToSortParams({
          title: "DESC",
          name: "ASC",
          ignored: "OTHER",
        }),
      ).toBe("-title,name");
    });
  });

  describe("injectObjectParamsToGetDataApi", () => {
    it("wraps the api to inject parsed params", async () => {
      const api = vi.fn().mockResolvedValue("ok");
      const wrapped = injectObjectParamsToGetDataApi(api, "adopter");

      await wrapped({ search: "key1::value1,, free text", page: 2 }, "arg1");

      expect(api).toHaveBeenCalledWith(
        { page: 2, key1: "value1", adopter: "free text" },
        "arg1",
      );
    });

    it("switches keys when a mapping is provided", async () => {
      const api = vi.fn().mockResolvedValue("ok");
      const wrapped = injectObjectParamsToGetDataApi(api, "adopter", {
        oldKey: "newKey",
        adopter: "adopter",
      });

      await wrapped({ search: "oldKey::7,, rest" });

      expect(api).toHaveBeenCalledWith({ newKey: "7", adopter: "rest" });
    });
  });
});
