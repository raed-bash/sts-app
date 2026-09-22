import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";
import { useThemeContext } from "@/contexts/ThemeContext";

const Toaster = ({ ...props }: ToasterProps) => {
  const { darkMode } = useThemeContext();

  return (
    <Sonner
      theme={darkMode ? "dark" : "light"}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      richColors
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "var(--success)",
          "--success-text": "#ffffff",
          "--success-border": "var(--success)",
          "--error-bg": "var(--destructive)",
          "--error-text": "#ffffff",
          "--error-border": "var(--destructive)",
          "--warning-bg": "var(--warning)",
          "--warning-text": "#1f2937",
          "--warning-border": "var(--warning)",
          "--info-bg": "var(--info)",
          "--info-text": "#1f2937",
          "--info-border": "var(--info)",
          "--border-radius": "var(--radius)",
          "--swipe-right": "var(--destructive)",
          "--swipe-left": "var(--destructive)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
