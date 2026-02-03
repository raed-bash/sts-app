import { useEffect, useState } from "react";

export type UseAnimationOptions = {
  isOpen?: boolean;
};

export default function useAnimation({ isOpen = false }: UseAnimationOptions) {
  const [show, setShow] = useState(isOpen);

  const [showAnimation, setShowAnimation] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShow(true);
      setShowAnimation(true);
    } else {
      setShowAnimation(false);
      const id = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(id);
    }
  }, [isOpen]);

  return { show, showAnimation };
}
