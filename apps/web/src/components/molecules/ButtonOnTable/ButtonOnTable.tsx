import React from "react";
import Button from "../../atoms/Button/Button";

interface ButtonOnTableProps {
  state: string;
  isOwner: boolean;
  loading: boolean;
  showCards: () => void;
  restartGame: () => void;
}

const ButtonOnTable: React.FC<ButtonOnTableProps> = ({
  state,
  isOwner,
  loading,
  showCards,
  restartGame,
}) => {
  if (loading || !isOwner) return null;

  switch (state) {
    case "ready_to_show_cards":
      return (
        <Button onClick={showCards} className="btn-on-table">
          Revelar cartas
        </Button>
      );
    case "revealed_cards":
      return (
        <Button onClick={restartGame} className="btn-on-table">
          Nueva votación
        </Button>
      );
    default:
      return null;
  }
};

export default ButtonOnTable;
