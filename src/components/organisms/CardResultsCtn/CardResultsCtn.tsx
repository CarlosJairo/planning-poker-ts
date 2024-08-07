import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import CardResult from "../../molecules/CardResult/CardResult";
import Avarage from "../../molecules/Avarage/Avarage";
import "./CardResultsCtn.css";

const CardResultsCtn: React.FC = () => {
  const results = useSelector((state: RootState) => state.game.results);

  return (
    <section className="card-results-container">
      <div className="cards-results">
        {results &&
          results.count.map((card) => (
            <CardResult key={Math.random()} card={card} revealedCards={true} />
          ))}
        <Avarage />
      </div>
    </section>
  );
};

export default CardResultsCtn;
