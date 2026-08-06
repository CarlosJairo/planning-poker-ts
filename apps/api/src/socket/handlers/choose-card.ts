import type { Server, Socket } from "socket.io";
import type { AckResponse, ChooseCardPayload } from "@planning-poker/shared";
import { voteFor } from "../services/game-service";
import { broadcast } from "../utils/broadcast";
import { getRoomForSocket } from "../utils/guards";

export const registerChooseCard = (io: Server, socket: Socket): void => {
  socket.on(
    "choose-card",
    (payload: ChooseCardPayload | undefined, ack?: (response: AckResponse) => void) => {
      const room = getRoomForSocket(socket, ack);
      if (!room) return;
      const player = room.players.find((p) => p.id === socket.id);
      if (!player || !player.roles.includes("player")) {
        ack?.({ ok: false, error: "Solo los jugadores pueden elegir carta" });
        return;
      }
      if (room.state === "revealed_cards") {
        ack?.({ ok: false, error: "Las cartas ya fueron reveladas" });
        return;
      }
      if (typeof player.voted === "object") {
        ack?.({ ok: false, error: "Ya elegiste una carta" });
        return;
      }
      const card = room.poolCards.find((c) => c.id === payload?.cardId);
      if (!card) {
        ack?.({ ok: false, error: "Carta no válida" });
        return;
      }
      voteFor(room, player, card);
      broadcast(io, room);
      ack?.({ ok: true });
    }
  );
};
