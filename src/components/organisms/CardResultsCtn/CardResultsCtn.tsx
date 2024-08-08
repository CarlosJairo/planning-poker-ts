import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import CardResult from "../../molecules/CardResult/CardResult";
import Avarage from "../../molecules/Avarage/Avarage";
import "./CardResultsCtn.scss";

const CardResultsCtn: React.FC = () => {
  const results = useSelector((state: RootState) => state.game.results);

  return (
    <section className="o-card-results">
      <div className="o-card-results__results">
        {results &&
          results.count.map((card) => (
            <CardResult key={Math.random()} card={card} />
          ))}
        <Avarage />
      </div>
    </section>
  );
};

export default CardResultsCtn;
