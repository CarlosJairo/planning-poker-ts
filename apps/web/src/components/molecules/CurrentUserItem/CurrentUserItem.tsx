import React from "react";
import { useSelector } from "react-redux";
import { changeMode } from "../../../services/socket";
import UserLogo from "../../atoms/UserLogo/UserLogo";
import Button from "../../atoms/Button/Button";
import CardOnTable from "../../atoms/CardOnTable/CardOnTable";
import { ReetWeet } from "../../atoms/Icons";
import "./CurrentUserItem.scss";

interface CurrentUser {
  id: string;
  name: string;
  voted: { id: string; str: string; value: number } | boolean;
  rolCurrentUser: string[];
}

interface State {
  game: {
    state: string;
  };
}

interface CurrentUserItemProps {
  user: CurrentUser;
}

const CurrentUserItem: React.FC<CurrentUserItemProps> = ({ user }) => {
  const { name, voted, rolCurrentUser } = user;

  const { state } = useSelector((state: State) => state.game);
  const revealedCards = state === "revealed_cards" || state === "finished";

  const isViwer = rolCurrentUser.includes("viwer");

  const changeRol = () => {
    changeMode();
  };

  return (
    <div className={`m-current-user`}>
      {isViwer ? (
        <UserLogo name={name} />
      ) : (
        <CardOnTable voted={voted} revealedCards={revealedCards} />
      )}
      <p className={"m-current-user__name"}>
        <Button onClick={changeRol}>
          <ReetWeet />
        </Button>
        {name}
      </p>
    </div>
  );
};

export default CurrentUserItem;
