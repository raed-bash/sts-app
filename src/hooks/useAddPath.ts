import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

export default function useAddPath(paths) {
  const { handleAddPaths } = useOutletContext();

  useEffect(() => {
    handleAddPaths(paths);

    return () => handleAddPaths([]);
  }, [handleAddPaths, paths]);
}
