import type { Server, Socket } from "socket.io";
import { ALL_POOLS } from "@planning-poker/shared";
import type { AckResponse, ChangePoolPayload } from "@planning-poker/shared";
import { switchPool } from "../services/game-service";
import { broadcast } from "../utils/broadcast";
import { getRoomForSocket, requireOwner } from "../utils/guards";

export const registerChangePool = (io: Server, socket: Socket): void => {
  socket.on(
    "change-pool",
    (payload: ChangePoolPayload | undefined, ack?: (response: AckResponse) => void) => {
      const room = getRoomForSocket(socket, ack);
      if (!room) return;
      if (!requireOwner(room, socket, ack)) return;
      if (room.state === "revealed_cards") {
        ack?.({
          ok: false,
          error: "Reinicia la partida antes de cambiar el modo de puntajes.",
        });
        return;
      }
      const poolKey = payload?.poolKey ?? "";
      if (!ALL_POOLS[poolKey]) {
        ack?.({ ok: false, error: "Modo de puntajes inválido" });
        return;
      }
      switchPool(room, poolKey);
      broadcast(io, room);
      ack?.({ ok: true });
    }
  );
};
