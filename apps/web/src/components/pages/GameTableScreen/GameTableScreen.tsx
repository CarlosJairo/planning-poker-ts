import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import Button from "../../atoms/Button/Button";
import {
  getJoin,
  joinRoom,
  clearJoin,
  roomExists,
} from "../../../services/socket";
import "./GameTableScreen.scss";

type RoomStatus = "checking" | "exists" | "missing";

const GameTableScreen: React.FC = () => {
  const [modalForm, toggleModalUserForm] = useModal(true);
  const [modalLink, toggleModalLink] = useModal(false);
  const [roomStatus, setRoomStatus] = useState<RoomStatus>("checking");
  const { roomId } = useParams();
  const navigate = useNavigate();

  const { poolCards, state } = useSelector((state: RootState) => state.game);
  const currentUser = useSelector((state: RootState) => state.user);
  const autoJoined = useRef(false);

  useEffect(() => {
    void roomExists(roomId ?? "").then((response) => {
      setRoomStatus(response.exists ? "exists" : "missing");
    });
  }, [roomId]);

  useEffect(() => {
    if (autoJoined.current || roomStatus !== "exists") return;
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
        if (response.error && /no existe/i.test(response.error)) {
          setRoomStatus("missing");
        } else {
          clearJoin();
        }
      }
    });
  }, [roomId, currentUser.id, roomStatus, toggleModalUserForm]);

  const handleCreateGame = () => {
    navigate("/");
  };

  if (roomStatus === "missing") {
    return (
      <section className="game-table-screen game-table-screen--missing">
        <p className="game-table-screen__missing-title">La partida no existe</p>
        <p className="game-table-screen__missing-subtitle">
          El enlace puede ser incorrecto o la sala ya fue eliminada.
        </p>
        <Button onClick={handleCreateGame}>Crear partida</Button>
      </section>
    );
  }

  return (
    <section className="game-table-screen">
      <HeaderTableScreen toggleModalLink={toggleModalLink} />

      <TableAndPlayers />

      {state === "revealed_cards" ? (
        <CardResultsCtn />
      ) : (
        <SelectableCardContainer poolCards={poolCards} />
      )}

      {roomStatus === "exists" && modalForm && (
        <Modal isOpen={modalForm}>
          <UserForm
            toggleModalUserForm={toggleModalUserForm}
            onRoomMissing={() => setRoomStatus("missing")}
          />
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
