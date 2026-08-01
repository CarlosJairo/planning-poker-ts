import React, { ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { changePool } from "../../../services/socket";
import Option from "../../atoms/Option/Option";
import "./SelectPoolCards.scss";

const SelectPoolCards: React.FC = () => {
  const { allPoolCards, poolKey, state, selectedCards } = useSelector(
    (state: RootState) => state.game
  );
  const { rolCurrentUser } = useSelector((state: RootState) => state.user);

  const isOwner = rolCurrentUser.includes("owner");

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    changePool(e.target.value);
  };

  return (
    <>
      {isOwner && state !== "revealed_cards" && selectedCards.length === 0 && (
        <select
          name="poolCard"
          id="poolCard"
          className="select-pool-cards"
          onChange={handleChange}
          value={poolKey}
        >
          {Object.keys(allPoolCards).map((key) => (
            <Option key={key} value={key}>
              {key.toUpperCase()}
            </Option>
          ))}
        </select>
      )}
    </>
  );
};

export default SelectPoolCards;
