import { ButtonHTMLAttributes, ReactNode } from "react";
import "./Button.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({ className, children, ...props }) => (
  <button className={className || ""} {...props}>
    {children}
  </button>
);

export default Button;
