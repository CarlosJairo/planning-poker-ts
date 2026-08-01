import React from "react";
import "./UserLogo.scss";

interface UserLogoProps {
  name: string;
}

const UserLogo: React.FC<UserLogoProps> = ({ name }) => {
  return <p className="a-user-logo">{name[0] || "-"}</p>;
};

export default UserLogo;
