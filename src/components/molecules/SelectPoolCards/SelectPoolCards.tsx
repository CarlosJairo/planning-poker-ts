import React, { useState, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { changePoolCards } from "../../../reducers/game/gameSlice";
import Option from "../../atoms/Option/Option";
import "./SelectPoolCards.css";

const SelectPoolCards: React.FC = () => {
  const [value, setValue] = useState<string>("fibonacci");
  const { allPoolCards, selectedCards } = useSelector(
    (state: RootState) => state.game
  );
  const { rolCurrentUser } = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
    dispatch(changePoolCards(e.target.value));
  };

  return (
    <>
      {rolCurrentUser.includes("owner") && selectedCards.length === 0 && (
        <select
          name="poolCard"
          id="poolCard"
          className="select-pool-cards"
          onChange={handleChange}
          value={value}
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
