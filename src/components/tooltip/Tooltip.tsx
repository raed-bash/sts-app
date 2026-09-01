import React, {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "src/utils/cn";
import { type TooltipPlacement } from "./tooltip-placement-style";

const GAP = 8;

function getAnchorStyle(
  rect: DOMRect,
  placement: TooltipPlacement,
): CSSProperties {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const map: Partial<Record<TooltipPlacement, CSSProperties>> = {
    top: { top: rect.top, left: cx, translate: `-50% calc(-100% - ${GAP}px)` },
    "top-left": {
      top: rect.top,
      left: rect.left,
      translate: `0 calc(-100% - ${GAP}px)`,
    },
    "top-right": {
      top: rect.top,
      left: rect.right,
      translate: `-100% calc(-100% - ${GAP}px)`,
    },
    bottom: { top: rect.bottom, left: cx, translate: `-50% ${GAP}px` },
    "bottom-left": {
      top: rect.bottom,
      left: rect.left,
      translate: `0 ${GAP}px`,
    },
    "bottom-right": {
      top: rect.bottom,
      left: rect.right,
      translate: `-100% ${GAP}px`,
    },
    left: {
      top: cy,
      left: rect.left,
      translate: `calc(-100% - ${GAP}px) -50%`,
    },
    right: { top: cy, left: rect.right, translate: `${GAP}px -50%` },
  };

  return { position: "fixed", ...(map[placement] ?? map.bottom) };
}

function getChildRef(child: ReactElement): React.Ref<unknown> | null {
  return (
    (child.props as { ref?: React.Ref<unknown> }).ref ??
    (child as unknown as { ref?: React.Ref<unknown> }).ref ??
    null
  );
}

export type TooltipProps = {
  children: ReactElement;
  title?: ReactNode;
  placement?: TooltipPlacement;
  tooltipProps?: React.HTMLAttributes<HTMLDivElement>;
  delay?: number;
  disabled?: boolean;
};

function Tooltip({
  children,
  title,
  placement = "bottom",
  tooltipProps = {},
  delay = 0,
  disabled = false,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [anchorStyle, setAnchorStyle] = useState<CSSProperties>({});
  const [mounted, setMounted] = useState(false); // SSR guard
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const tooltipId = useId();
  const childRef = getChildRef(children);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(
    () => () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    },
    [],
  );

  function assignRef<T>(ref: React.Ref<T> | undefined, value: T) {
    if (typeof ref === "function") {
      ref(value);
    } else if (ref) {
      (ref as React.MutableRefObject<T>).current = value;
    }
  }

  const injectedRef = useCallback(
    (node: HTMLElement | null) => {
      triggerRef.current = node;

      assignRef(childRef, node);
    },
    [childRef],
  );

  const computeAnchor = useCallback(() => {
    if (!triggerRef.current) return;
    setAnchorStyle(
      getAnchorStyle(triggerRef.current.getBoundingClientRect(), placement),
    );
  }, [placement]);

  const show = useCallback(() => {
    if (disabled || !title) return;
    computeAnchor();
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (delay > 0) {
      timerRef.current = setTimeout(() => setVisible(true), delay);
    } else {
      setVisible(true);
    }
  }, [disabled, title, delay, computeAnchor]);

  const hide = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setVisible(false);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const dismiss = () => hide();
    window.addEventListener("scroll", dismiss, {
      capture: true,
      passive: true,
    });
    window.addEventListener("resize", dismiss, { passive: true });
    return () => {
      window.removeEventListener("scroll", dismiss, { capture: true });
      window.removeEventListener("resize", dismiss);
    };
  }, [visible, hide]);

  const isVisible = visible && !disabled && !!title;

  const p = children.props as React.HTMLAttributes<HTMLElement>;

  type TooltipTriggerElement = React.ReactElement<
    React.HTMLAttributes<HTMLElement> & {
      ref?: React.Ref<HTMLElement>;
    }
  >;

  // eslint-disable-next-line react-hooks/refs
  const trigger = React.cloneElement(children as TooltipTriggerElement, {
    ref: injectedRef,
    "aria-describedby": isVisible ? tooltipId : undefined,

    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      show();
      p.onMouseEnter?.(e);
    },

    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      hide();
      p.onMouseLeave?.(e);
    },

    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      show();
      p.onFocus?.(e);
    },

    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      hide();
      p.onBlur?.(e);
    },

    onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === "Escape") hide();

      p.onKeyDown?.(e);
    },
  });
  return (
    <>
      {trigger}

      {title &&
        mounted &&
        createPortal(
          <div
            role="tooltip"
            id={tooltipId}
            {...tooltipProps}
            style={{
              ...tooltipProps.style,
              ...anchorStyle,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "scale(1)" : "scale(0.95)",
              transition: "opacity 150ms ease-out, transform 150ms ease-out",
              pointerEvents: "none",
            }}
            className={cn(
              "p-2 text-sm bg-(--background) text-(--text) rounded font-medium",
              "z-9999 shadow-md whitespace-nowrap select-none",
              tooltipProps.className,
            )}
            aria-hidden={!isVisible}
          >
            {title}
          </div>,
          tooltipRoot!,
        )}
    </>
  );
}

const tooltipRoot = document.getElementById("tooltip-root");
export default Tooltip;
