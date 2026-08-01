import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { resetGame, revealCards } from "../../../services/socket";
import { RootState } from "../../../app/store";
import ButtonOnTable from "../ButtonOnTable/ButtonOnTable";
import LouderTable from "../../atoms/LouderTable/LouderTable";
import "./Table.scss";

interface TableProps {
  roles: string[];
}

const Table: React.FC<TableProps> = ({ roles }) => {
  const [loading, setLoading] = useState(false);
  const { state } = useSelector((state: RootState) => state.game);
  const isOwner = roles.includes("owner");

  useEffect(() => {
    if (state === "revealed_cards") {
      setLoading(false);
    }
  }, [state]);

  const showCards = () => {
    setLoading(true);
    revealCards();
  };

  const handleRestartGame = () => {
    resetGame();
  };

  return (
    <div className="m-table">
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
