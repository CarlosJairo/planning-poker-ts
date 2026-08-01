import React, { ReactNode } from "react";

interface OptionProps {
  children: ReactNode;
  value: string;
}

const Option: React.FC<OptionProps> = ({ children, value }) => {
  return <option value={value}>{children}</option>;
};

export default Option;
