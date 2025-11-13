import { memo } from "react";
import InputPlus from "./InputPlus";

/**
 * @typedef utils
 * @property {string} language
 * @property {object} values
 * @property {object} errors
 */

/**
 * @typedef inputPlusFormikProps
 * @type {import('./InputPlus').inputPlusProps & utils}
 */

/**
 * @param {inputPlusFormikProps} props
 */
function InputPlusFormik(props) {
  const { language, values = {}, errors = {}, ...otherProps } = props;

  return (
    <InputPlus
      {...otherProps}
      error
      helperText={errors[otherProps.name]}
      value={values[otherProps.name]}
    />
  );
}

export default memo(InputPlusFormik);
