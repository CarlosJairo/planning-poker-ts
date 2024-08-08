import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleViwer } from "../../../reducers/game/gameSlice";
import { toggleViwerCurrent } from "../../../reducers/user/userSlice";
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
  const { id, name, voted, rolCurrentUser } = user;

  const { state } = useSelector((state: State) => state.game);
  const revealedCards = state === "revealed_cards" || state === "finished";

  const dispatch = useDispatch();

  const isViwer = rolCurrentUser.includes("viwer");
  const isOwner = rolCurrentUser.includes("owner");

  const changeRol = () => {
    dispatch(toggleViwer(id));
    dispatch(toggleViwerCurrent());
  };

  return (
    <div className={`m-current-user`}>
      {isViwer ? (
        <UserLogo name={name} />
      ) : (
        <CardOnTable voted={voted} revealedCards={revealedCards} />
      )}
      <p className={"m-current-user__name"}>
        {isOwner && (
          <Button onClick={changeRol}>
            <ReetWeet />
          </Button>
        )}
        {name}
      </p>
    </div>
  );
};

export default CurrentUserItem;
