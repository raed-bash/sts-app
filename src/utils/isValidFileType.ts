import { validFileExtensions } from "src/constants/validFileExtensions";

export function isValidFileType(fileName: string, fileType: string) {
  const fileExtension = fileName.split(".").pop();

  return (
    fileName &&
    fileExtension &&
    validFileExtensions[fileType].indexOf(fileExtension) > -1
  );
}
