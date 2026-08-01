import { FC, ChangeEvent } from "react";

interface InputProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const InputText: FC<InputProps> = ({
  id = "",
  name = "",
  value = "",
  onChange,
}) => {
  return (
    <input
      data-testid="input-text"
      type="text"
      name={name}
      id={id}
      value={value}
      onChange={onChange}
      required
    />
  );
};

export default InputText;
