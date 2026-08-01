import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { chooseCard } from "../../../services/socket";
import { RootState } from "../../../app/store";
import Card from "../../atoms/Card/Card";
import SelectPoolCards from "../../molecules/SelectPoolCards/SelectPoolCards";
import "./SelectableCardContainer.scss";

interface CardType {
  id: string;
  str: string;
  value: number;
}

interface SelectableCardContainerProps {
  poolCards: CardType[];
}

const SelectableCardContainer: React.FC<SelectableCardContainerProps> = ({
  poolCards,
}) => {
  const [disabledCards, setDisabledCards] = useState(false);
  const { rolCurrentUser, voted } = useSelector(
    (state: RootState) => state.user
  );

  const isViwer = rolCurrentUser.includes("viwer");
  const hasVoted = typeof voted === "object";

  useEffect(() => {
    if (!hasVoted) {
      setDisabledCards(false);
    }
  }, [hasVoted]);

  const sendCard = (card: CardType) => {
    chooseCard(card.id);
    setDisabledCards(true);
  };

  return (
    <section
      className={`o-selectable-cards ${isViwer && "o-selectable-cards--none"} `}
      data-testid="selectable-card-container"
    >
      <div className="o-selectable-cards__title-select">
        <h6>Elige una carta 👇</h6>
        <SelectPoolCards />
      </div>
      <div
        className={`${
          disabledCards && "o-selectable-cards__cards--disabled"
        } o-selectable-cards__cards`}
      >
        {poolCards.length > 0 ? (
          poolCards.map((card) => (
            <Card
              key={card.str}
              className={"a-card"}
              onClick={() => sendCard(card)}
              card={card}
            >
              {card.str}
            </Card>
          ))
        ) : (
          <p>No hay cartas</p>
        )}
      </div>
    </section>
  );
};

export default SelectableCardContainer;
