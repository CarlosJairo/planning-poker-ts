import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeStateGame,
  countCardsAndAverage,
  restartGame,
} from "../../../reducers/game/gameSlice";
import { resetVoted } from "../../../reducers/user/userSlice";
import { RootState } from "../../../app/store";
import "./Table.css";
import ButtonOnTable from "../ButtonOnTable/ButtonOnTable";
import LouderTable from "../../atoms/LouderTable/LouderTable";

interface TableProps {
  roles: string[];
}

const Table: React.FC<TableProps> = ({ roles }) => {
  const [loading, setLoading] = useState(false);
  const { state } = useSelector((state: RootState) => state.game);
  const isOwner = roles.includes("owner");

  const dispatch = useDispatch();

  const showCards = () => {
    setLoading(true);

    // Simulación de llamada a API
    setTimeout(() => {
      setLoading(false);
      dispatch(changeStateGame("revealed_cards"));
      dispatch(countCardsAndAverage());
    }, 2000);
  };

  const handleRestartGame = () => {
    dispatch(restartGame());
    dispatch(resetVoted());
  };

  return (
    <div className="table">
      {loading && <LouderTable />}

      <ButtonOnTable
        state={state}
        isOwner={isOwner}
        loading={loading}
        showCards={showCards}
        restartGame={handleRestartGame}
      />
    </div>
  );
};

export default Table;
