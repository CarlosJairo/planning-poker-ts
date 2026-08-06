/* eslint-disable react-refresh/only-export-components */
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import Locker from "../../molecules/Locker/Locker";
import CurrentUserItem from "../../molecules/CurrentUserItem/CurrentUserItem";
import UserItem from "../../molecules/UserItem/UserItem";
import Table from "../../molecules/Table/Table";
import "./TableAndPlayers.scss";

// Exportar para hacer prueba unitaria
export const filterPlayers = (
  players: User[],
  currentUser: UserState
): User[] => players.filter((player) => player.id !== currentUser.id);

interface User {
  id: string;
  name: string;
  voted: { id: string; str: string; value: number } | boolean;
  roles: string[];
}

interface UserState {
  id: string;
  name: string;
  voted: { id: string; str: string; value: number } | boolean;
  rolCurrentUser: string[];
}

const TableAndPlayers: React.FC = () => {
  const { players } = useSelector((state: RootState) => state.game);
  const currentUser = useSelector((state: RootState) => state.user);

  // Filtrar solo otros jugadores - evitar que aparezca nuevamente el usuario actual que ya tiene su lugar
  const filteredPlayers = filterPlayers(players, currentUser);

  return (
    <section
      className="o-table-and-players"
      data-testid="table-and-players"
    >
      <Locker className={"currentUser user-item"}>
        <CurrentUserItem user={currentUser} />
      </Locker>

      <Locker className="table-locker">
        <Table roles={currentUser.rolCurrentUser} />
      </Locker>

      {filteredPlayers &&
        filteredPlayers.slice(0, 7).map((user, index) => (
          <Locker className={`user${index}`} key={index}>
            <UserItem user={user} key={user.id} />
          </Locker>
        ))}

      {filteredPlayers && filteredPlayers.length > 7 && (
        <Locker className="overflow-players">
          {filteredPlayers.slice(7).map((user) => (
            <UserItem user={user} key={user.id} />
          ))}
        </Locker>
      )}
    </section>
  );
};

export default TableAndPlayers;
