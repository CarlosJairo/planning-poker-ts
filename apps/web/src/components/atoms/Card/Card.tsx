import { useState } from "react";
import "./Card.scss";

interface CardProps {
  children: React.ReactNode;
  onClick: (card: CardType) => void;
  className?: string;
  card: CardType;
}

interface CardType {
  id: string;
  str: string;
  value: number;
}

const Card: React.FC<CardProps> = ({ children, onClick, className, card }) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    setIsSelected(!isSelected);
    onClick(card);
  };

  return (
    <button
      onClick={handleClick}
      className={`${className || ""} ${isSelected ? "selected" : ""}`}
    >
      {children}
    </button>
  );
};

export default Card;
