import React from "react";
import { useSelector } from "react-redux";
import { FichaPoker, UserPlus } from "../../atoms/Icons";
import { RootState } from "../../../app/store";
import UserLogo from "../../atoms/UserLogo/UserLogo";
import "./HeaderTableScreen.css";

interface HeaderTableScreenProps {
  toggleModalLink: () => void;
}

const HeaderTableScreen: React.FC<HeaderTableScreenProps> = ({
  toggleModalLink,
}) => {
  const { gameName } = useSelector((state: RootState) => state.game);
  const { name } = useSelector((state: RootState) => state.user);

  return (
    <header className="header-table-screen">
      <FichaPoker className={"chip-poker"} />
      <h1>{gameName}</h1>
      <div className="menu-table-screen">
        <UserLogo name={name} />
        <button onClick={toggleModalLink} className="invite-players-btn">
          <span className="invite-player-text">Invitar jugadores</span>{" "}
          <UserPlus className={"user-plus"} />
        </button>
      </div>
    </header>
  );
};

export default HeaderTableScreen;
