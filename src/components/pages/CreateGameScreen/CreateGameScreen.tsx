import React from "react";
import HeaderHome from "../../organisms/HeaderHome/HeaderHome";
import CreateGameForm from "../../organisms/CreateGameForm/CreateGameForm";
import "./CreateGameScreen.css";

const CreateGameScreen: React.FC = () => {
  return (
    <section className="create-game-screen">
      <HeaderHome />
      <CreateGameForm />
    </section>
  );
};

export default CreateGameScreen;
