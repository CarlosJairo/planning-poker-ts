import React from "react";

interface CardOnTableProps {
  voted: { id: string; str: string; value: number } | boolean;
  revealedCards: boolean;
}

const CardOnTable: React.FC<CardOnTableProps> = ({ voted, revealedCards }) => {
  const isVotedObject = typeof voted !== "boolean";

  return (
    <div
      className={`card-on-table ${isVotedObject ? "selected" : ""} ${
        revealedCards ? "show" : ""
      }`}
    >
      {revealedCards && isVotedObject && (voted as { str: string }).str}
    </div>
  );
};

export default CardOnTable;

// import React from "react";

// interface CardOnTableProps {
//   voted: { id: string; str: string; value: number } | boolean;
//   revealedCards: boolean;
// }

// const CardOnTable: React.FC<CardOnTableProps> = ({ voted, revealedCards }) => {
//   return (
//     <div
//       className={`card-on-table ${voted && "selected"} ${
//         revealedCards && "show"
//       }`}
//     >
//       {revealedCards && voted.str}
//     </div>
//   );
// };

// export default CardOnTable;
