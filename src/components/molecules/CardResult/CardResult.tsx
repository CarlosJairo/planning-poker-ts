import React from "react";
import CardOnTable from "../../atoms/CardOnTable/CardOnTable";

interface Card {
  id: string;
  str: string;
  value: number;
  votes: number;
}

interface CardResultProps {
  card: Card;
}

const CardResult: React.FC<CardResultProps> = ({ card }) => {
  return (
    <div className="card-result">
      <CardOnTable voted={card} revealedCards={true} />
      <p>
        {card.votes} voto{card.votes > 1 && "s"}
      </p>
    </div>
  );
};

export default CardResult;
