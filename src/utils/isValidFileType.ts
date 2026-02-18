import { validFileExtensions } from "src/constants/valid-file-extensions";

export function isValidFileType(fileName: string, fileType: string) {
  const fileExtension = fileName.split(".").pop();

  return (
    fileName &&
    fileExtension &&
    validFileExtensions[fileType].indexOf(fileExtension) > -1
  );
}
