import React from "react";
import { useSelector } from "react-redux";
import Button from "../../atoms/Button/Button";
import { UserPlus } from "../../atoms/Icons";
import CardOnTable from "../../atoms/CardOnTable/CardOnTable";
import UserLogo from "../../atoms/UserLogo/UserLogo";
import { RootState } from "../../../app/store";
import { updateRoles } from "../../../services/socket";
import "./UserItem.scss";

interface User {
  id: string;
  name: string;
  voted: { id: string; str: string; value: number } | boolean;
  roles: string[];
}

interface UserItemProps {
  user: User;
}

const UserItem: React.FC<UserItemProps> = ({ user }) => {
  const { id, name, voted, roles } = user;

  const state = useSelector((state: RootState) => state.game.state);

  const rolCurrentUser = useSelector(
    (state: RootState) => state.user.rolCurrentUser
  );

  const revealedCards = state === "revealed_cards" || state === "finished";

  const isViwer = roles.includes("viwer");
  const isOwner = roles.includes("owner");
  const isUserCurrentOwner = rolCurrentUser.includes("owner");

  const addAdmin = () => {
    updateRoles(id);
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
          <Button onClick={addAdmin} title="Fijar como admin">
            <UserPlus className="" />
          </Button>
        )}
        {user.name}
      </p>
    </div>
  );
};

export default UserItem;
