import { memo, useMemo } from "react";
import Skeleton from "../skeleton/Skeleton";
import Input from "./Input";
import TextArea from "./TextArea";
import { twMerge } from "tailwind-merge";
import SelectApi from "./SelectApi";
import RawSelect from "./RawSelect/RawSelect";
import AutocompleteApi from "./AutocompleteApi";

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
function InputPlus(props) {
  const {
    title,
    titleIcon,
    loading,
    inputPlusContainerProps = {},
    skeletonProps = {},
    titleProps = {},
    ...inputProps
  } = props;
  const containerClassNameMemo = useMemo(
    () => twMerge("flex flex-col gap-1", inputPlusContainerProps.className),
    [inputPlusContainerProps.className]
  );

  const titleClassNameMemo = useMemo(
    () =>
      twMerge(
        "max-lg:text-[14px] text-[20px] font-medium flex gap-1",
        titleProps.className
      ),
    [titleProps.className]
  );

  return (
    <div {...inputPlusContainerProps} className={containerClassNameMemo}>
      <h2 {...titleProps} className={titleClassNameMemo}>
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

export default memo(InputPlus);

export const selectsTypes = ["select", "selectApi", "autocompleteApi"];
