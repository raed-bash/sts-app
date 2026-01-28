import { useEffect } from "react";

export default function useFocusout(
  elementRef: React.RefObject<HTMLElement | null>,
  onFocusout: () => void,
) {
  useEffect(() => {
    const handleClickOutSideMenu = (e: MouseEvent) => {
      if (
        elementRef.current &&
        !elementRef.current.contains(e.target as Node)
      ) {
        onFocusout();
      }
    };

    document.addEventListener("mousedown", handleClickOutSideMenu);
    return () =>
      document.removeEventListener("mousedown", handleClickOutSideMenu);
  }, [onFocusout, elementRef]);
}
