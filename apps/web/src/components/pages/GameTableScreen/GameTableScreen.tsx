import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
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
import { getJoin, joinRoom, clearJoin } from "../../../services/socket";
import "./GameTableScreen.scss";

const GameTableScreen: React.FC = () => {
  const [modalForm, toggleModalUserForm] = useModal(true);
  const [modalLink, toggleModalLink] = useModal(false);
  const { roomId } = useParams();

  const { poolCards, state } = useSelector((state: RootState) => state.game);
  const currentUser = useSelector((state: RootState) => state.user);
  const autoJoined = useRef(false);

  useEffect(() => {
    if (autoJoined.current) return;
    const stored = getJoin();
    if (!stored || stored.roomId !== roomId || currentUser.id) return;
    autoJoined.current = true;

    void joinRoom({
      roomId: stored.roomId,
      name: stored.name,
      mode: stored.mode,
      isOwner: stored.isOwner,
    }).then((response) => {
      if (response.ok) {
        toggleModalUserForm();
      } else {
        autoJoined.current = false;
        clearJoin();
      }
    });
  }, [roomId, currentUser.id, toggleModalUserForm]);

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
