export const ButtonTheme = {
  contained: {
    primary:
      "text-white bg-(--primary) hover:bg-(--primary-hover) focus:ring-(--primary)/30 focus:border-(--primary)",
    success:
      "text-white bg-(--success) hover:bg-(--success-hover) focus:ring-(--success)/30 focus:border-(--success)",
    secondary:
      "text-white bg-(--secondary) hover:bg-(--secondary-hover)  focus:ring-(--secondary)/30 focus:border-(--secondary)",
    danger:
      "text-white bg-(--danger) hover:bg-(--danger-hover) focus:ring-(--danger)/30 focus:border-(--danger)",
    warning:
      "text-white bg-(--warning) hover:bg-(--warning-hover) focus:ring-(--warning)/30 focus:border-(--warning)",
    info: "text-white bg-(--info) hover:bg-(--info-hover) focus:ring-(--info)/30 focus:border-(--info)",
  },
  outlined: {
    primary:
      "text-(--primary) border-(--primary) border hover:bg-(--primary)/10 focus:ring-(--primary)/30 focus:border-(--primary)",
    success:
      "text-(--success) border-(--success) border hover:bg-(--success)/10 focus:ring-(--success)/30 focus:border-(--success)",
    secondary:
      "text-(--secondary) border-(--secondary) border-[1px] hover:bg-(--secondary)/10 focus:ring-(--secondary)/30 focus:border-(--secondary)",
    danger:
      "text-(--danger) border-(--danger) border-[1px] hover:bg-(--danger)/10 focus:ring-(--danger)/30 focus:border-(--danger)",
    warning:
      "text-(--warning) border-(--warning) border-[1px] hover:bg-(--warning)/10 focus:ring-(--warning)/30 focus:border-(--warning)",
    info: "text-(--info) border-(--info) border-[1px] hover:bg-(--info)/10 focus:ring-(--info)/30 focus:border-(--info)",
  },
};

export type ButtonVariant = keyof typeof ButtonTheme;

export type ButtonColor = keyof (typeof ButtonTheme)["contained"];
