import { FC, ReactNode } from "react";

interface ButtonSubmitProps {
  disabled?: boolean;
  children: ReactNode;
}

const ButtonSubmit: FC<ButtonSubmitProps> = ({
  disabled = false,
  children,
}) => {
  return (
    <button type="submit" disabled={disabled}>
      {children}
    </button>
  );
};

export default ButtonSubmit;
