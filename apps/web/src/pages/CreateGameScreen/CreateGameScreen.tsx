import React from "react";
import HeaderHome from "../../components/organisms/HeaderHome/HeaderHome";
import CreateGameForm from "../../components/organisms/CreateGameForm/CreateGameForm";
import "./CreateGameScreen.scss";

const CreateGameScreen: React.FC = () => {
  return (
    <section className="create-game-screen">
      <HeaderHome />
      <CreateGameForm />
    </section>
  );
};

export default CreateGameScreen;
