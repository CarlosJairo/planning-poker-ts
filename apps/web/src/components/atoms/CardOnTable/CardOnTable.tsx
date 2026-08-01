import "./CardOnTable.scss";

interface CardOnTableProps {
  voted: { id: string; str: string; value: number } | boolean;
  revealedCards: boolean;
}

const CardOnTable: React.FC<CardOnTableProps> = ({ voted, revealedCards }) => {
  const isVotedObject = typeof voted !== "boolean";

  return (
    <div
      data-testid="card-on-table"
      className={`a-card-on-table ${
        isVotedObject ? "a-card-on-table--selected" : ""
      } ${revealedCards ? "a-card-on-table--show" : ""}`}
    >
      {revealedCards && isVotedObject && (voted as { str: string }).str}
    </div>
  );
};

export default CardOnTable;
