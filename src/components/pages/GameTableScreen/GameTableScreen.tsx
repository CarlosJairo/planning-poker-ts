import React from "react";
import Modal from "../../organisms/Modal/Modal";
import useModal from "../../../hooks/useModal";
import UserForm from "../../organisms/Formuser/FormUser";
import HeaderTableScreen from "../../organisms/HeaderTableScreen/HeaderTableScreen";
import ModalCopyLinkContent from "../../molecules/ModalCopyLinkContent/ModalCopyLinkContent";
import TableAndPlayers from "../../organisms/TableAndPlayers/TableAndPlayers";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import SelectableCardContainer from "../../organisms/SelectableCardContainer/SelectableCardContainer";
import CardResultsCtn from "../../organisms/CardResultsCtn/CardResultsCtn";
import "./GameTableScreen.scss";

const GameTableScreen: React.FC = () => {
  const [modalForm, toggleModalUserForm] = useModal(true);
  const [modalLink, toggleModalLink] = useModal(false);

  const { poolCards, state } = useSelector((state: RootState) => state.game);

  return (
    <section className="game-table-screen">
      <HeaderTableScreen toggleModalLink={toggleModalLink} />

      <TableAndPlayers />

      {state === "revealed_cards" ? (
        <CardResultsCtn />
      ) : (
        <SelectableCardContainer poolCards={poolCards} />
      )}

      {modalForm && (
        <Modal isOpen={modalForm}>
          <UserForm toggleModalUserForm={toggleModalUserForm} />
        </Modal>
      )}

      {modalLink && (
        <Modal isOpen={modalLink}>
          <ModalCopyLinkContent toggleModalLink={toggleModalLink} />
        </Modal>
      )}
    </section>
  );
};

export default GameTableScreen;
