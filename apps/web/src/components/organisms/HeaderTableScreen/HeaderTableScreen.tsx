import React from "react";
import { useSelector } from "react-redux";
import { FichaPoker, UserPlus } from "../../atoms/Icons";
import { RootState } from "../../../app/store";
import UserLogo from "../../atoms/UserLogo/UserLogo";
import "./HeaderTableScreen.scss";

interface HeaderTableScreenProps {
  toggleModalLink: () => void;
}

const HeaderTableScreen: React.FC<HeaderTableScreenProps> = ({
  toggleModalLink,
}) => {
  const { gameName } = useSelector((state: RootState) => state.game);
  const { name } = useSelector((state: RootState) => state.user);

  return (
    <header className="o-header-game" data-testid="header-table-screen">
      <FichaPoker className="o-header-game__a-chip" />
      <h1>{gameName}</h1>
      <div className="o-header-game__menu">
        <UserLogo name={name} />
        <button onClick={toggleModalLink} className="o-header-game__invite">
          <span className="o-header-game__invite-text">Invitar jugadores</span>
          <UserPlus className="o-header-game__user-plus" />
        </button>
      </div>
    </header>
  );
};

export default HeaderTableScreen;
