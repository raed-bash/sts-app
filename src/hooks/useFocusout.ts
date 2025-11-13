import { useEffect } from "react";

export default function useFocusout(elementRef, onFocusout) {
  useEffect(() => {
    const handleClickOutSideMenu = (e) => {
      if (elementRef.current && !elementRef.current.contains(e.target)) {
        onFocusout();
      }
    };

    document.addEventListener("mousedown", handleClickOutSideMenu);
    return () =>
      document.removeEventListener("mousedown", handleClickOutSideMenu);
  }, [onFocusout, elementRef]);
}
