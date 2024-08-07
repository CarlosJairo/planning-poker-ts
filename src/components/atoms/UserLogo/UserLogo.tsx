import React from "react";

interface UserLogoProps {
  name: string;
}

const UserLogo: React.FC<UserLogoProps> = ({ name }) => {
  return <p className="user-logo">{name[0] || "-"}</p>;
};

export default UserLogo;
