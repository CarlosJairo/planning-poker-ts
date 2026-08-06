import type { Server, Socket } from "socket.io";
import type { AckResponse } from "@planning-poker/shared";
import { togglePlayerMode } from "../services/game-service";
import { broadcast } from "../utils/broadcast";
import { getRoomForSocket } from "../utils/guards";

export const registerChangeMode = (io: Server, socket: Socket): void => {
  socket.on(
    "change-mode",
    (_payload: undefined, ack?: (response: AckResponse) => void) => {
      const room = getRoomForSocket(socket, ack);
      if (!room) return;
      const player = room.players.find((p) => p.id === socket.id);
      if (!player) {
        ack?.({ ok: false, error: "Jugador no encontrado" });
        return;
      }
      togglePlayerMode(room, player);
      broadcast(io, room);
      ack?.({ ok: true });
    }
  );
};
