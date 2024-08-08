import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../atoms/Button/Button";
import { UserPlus } from "../../atoms/Icons";
import CardOnTable from "../../atoms/CardOnTable/CardOnTable";
import UserLogo from "../../atoms/UserLogo/UserLogo";
import { RootState } from "../../../app/store";
import { addRolOwner } from "../../../reducers/game/gameSlice";
import "./UserItem.scss";

interface User {
  id: string;
  name: string;
  voted: { id: string; str: string; value: number } | boolean;
  rol: string[];
}

interface UserItemProps {
  user: User;
}

const UserItem: React.FC<UserItemProps> = ({ user }) => {
  const { id, name, voted, rol } = user;

  const state = useSelector((state: RootState) => state.game.state);
  const dispatch = useDispatch();

  const rolCurrentUser = useSelector(
    (state: RootState) => state.user.rolCurrentUser
  );

  const revealedCards = state === "revealed_cards" || state === "finished";

  const isViwer = rol.includes("viwer");
  const isOwner = rol.includes("owner");
  const isUserCurrentOwner = rolCurrentUser.includes("owner");

  const addAdmin = () => {
    dispatch(addRolOwner(id));
  };

  return (
    <div className={`m-user-item`}>
      {isViwer ? (
        <UserLogo name={name} />
      ) : (
        <CardOnTable voted={voted} revealedCards={revealedCards} />
      )}
      <p className={"m-user-item__name"}>
        {isUserCurrentOwner && !isOwner && (
          <Button onClick={addAdmin}>
            <UserPlus className="" />
          </Button>
        )}
        {user.name}
      </p>
    </div>
  );
};

export default UserItem;
