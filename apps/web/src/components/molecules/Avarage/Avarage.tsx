import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import "./Avarage.scss";

const replaceDotForComma = (numero: number): string => {
  return numero.toFixed(1).toString().replace(".", ",");
};

const Avarage: React.FC = () => {
  const avarage = useSelector((state: RootState) => state.game.results.avarage);
  return (
    <div className="m-avarage">
      <p>Promedio</p>
      <p>{replaceDotForComma(avarage)}</p>
    </div>
  );
};

export default Avarage;
