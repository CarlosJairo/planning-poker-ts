import { ChangeEvent } from "react";

interface InputRadioProps {
  name: string;
  value: string;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const InputRadio: React.FC<InputRadioProps> = ({
  name,
  value,
  checked,
  onChange,
}) => {
  return (
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      id={value}
    />
  );
};

export default InputRadio;
