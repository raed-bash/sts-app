import Skeleton, { type SkeletonProps } from "../skeleton/Skeleton";
import Input from "./Input";
import TextArea from "./TextArea";
import SelectApi from "./SelectApi";
import RawSelect from "./select/RawSelect";
import AutocompleteApi from "./AutocompleteApi";
import { cn } from "src/utils/cn";
import type { ReactNode } from "react";

export type InputPlusProps = React.InputHTMLAttributes<HTMLInputElement> & {
  title: string;

  titleIcon?: ReactNode;

  loading?: boolean;

  inputPlusContainerProps?: React.HTMLAttributes<HTMLDivElement>;

  skeletonProps?: SkeletonProps;

  titleProps?: React.HTMLAttributes<HTMLDivElement>;

  id?: string;
};

/**
 * @typedef utils
 * @property {string} title
 * @property {React.JSX.Element} titleIcon
 * @property {boolean} loading
 * @property {React.HTMLAttributes<HTMLDivElement>} inputPlusContainerProps
 * @property {import("../Skeleton/Skeleton").skeletonProps} skeletonProps
 * @property {React.HTMLAttributes<HTMLDivElement>} titleProps
 */

/**
 * @typedef inputPlusProps
 * @type {React.InputHTMLAttributes<HTMLInputElement> & import("./Input").utils & utils}
 */

/**
 *  @param {inputPlusProps} props
 */
function InputPlus({
  title,
  titleIcon,
  loading,
  inputPlusContainerProps = {},
  skeletonProps = {},
  titleProps = {},
  ...props
}: InputPlusProps) {
  return (
    <div
      {...inputPlusContainerProps}
      className={cn("flex flex-col gap-1", inputPlusContainerProps.className)}
    >
      <h2
        {...titleProps}
        className={cn(
          "max-lg:text-[14px] text-[20px] font-medium flex gap-1",
          titleProps.className
        )}
      >
        <label htmlFor={props.id}>{title}</label>
        {titleIcon}
      </h2>
      {loading ? (
        <Skeleton {...skeletonProps} />
      ) : inputProps.type === "select" ? (
        <RawSelect {...inputProps} />
      ) : inputProps.type === "textarea" ? (
        <TextArea {...inputProps} />
      ) : inputProps.type === "selectApi" ? (
        <SelectApi {...inputProps} />
      ) : inputProps.type === "autocompleteApi" ? (
        <AutocompleteApi {...inputProps} />
      ) : (
        <Input {...inputProps} />
      )}
    </div>
  );
}

export default InputPlus;

export const SelectsTypes = ["select", "selectApi", "autocompleteApi"];
