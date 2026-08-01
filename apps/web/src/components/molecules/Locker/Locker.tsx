import React, { ReactNode } from "react";

interface LockerProps {
  children: ReactNode;
  className?: string;
}

const Locker: React.FC<LockerProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

export default Locker;
