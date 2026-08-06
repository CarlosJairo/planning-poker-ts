import type { Server, Socket } from "socket.io";
import type { AckResponse } from "@planning-poker/shared";
import { resetGame } from "../services/game-service";
import { broadcast } from "../utils/broadcast";
import { getRoomForSocket, requireOwner } from "../utils/guards";

export const registerResetGame = (io: Server, socket: Socket): void => {
  socket.on(
    "reset-game",
    (_payload: undefined, ack?: (response: AckResponse) => void) => {
      const room = getRoomForSocket(socket, ack);
      if (!room) return;
      if (!requireOwner(room, socket, ack)) return;
      resetGame(room);
      broadcast(io, room);
      ack?.({ ok: true });
    }
  );
};
