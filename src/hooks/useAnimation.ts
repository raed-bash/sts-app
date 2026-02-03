import { useEffect, useState } from "react";

export type UseAnimationOptions = {
  isOpen?: boolean;
  duration?: number;
};

export default function useAnimation({
  isOpen = false,
  duration = 300,
}: UseAnimationOptions) {
  const [show, setShow] = useState(isOpen);

  const [showAnimation, setShowAnimation] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShow(true);
      setShowAnimation(true);
    } else {
      setShowAnimation(false);
      const id = setTimeout(() => setShow(false), duration);
      return () => clearTimeout(id);
    }
  }, [isOpen, duration]);

  return { show, showAnimation };
}
