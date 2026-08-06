import type { Server, Socket } from "socket.io";
import { validateUserName } from "@planning-poker/shared";
import type { AckResponse, JoinRoomPayload } from "@planning-poker/shared";
import { getRoom } from "../../rooms";
import { joinPlayer } from "../services/room-service";
import { syncState } from "../services/state-service";
import { broadcast } from "../utils/broadcast";

export const registerJoinRoom = (io: Server, socket: Socket): void => {
  socket.on(
    "join-room",
    (payload: JoinRoomPayload | undefined, ack?: (response: AckResponse) => void) => {
      const room = getRoom(payload?.roomId);
      if (!room) {
        ack?.({ ok: false, error: "La sala no existe" });
        return;
      }
      const name = payload?.name?.trim() ?? "";
      if (!validateUserName(name)) {
        ack?.({ ok: false, error: "Nombre inválido" });
        return;
      }
      const mode = payload?.mode;
      if (mode !== "player" && mode !== "viwer") {
        ack?.({ ok: false, error: "Modo de visualización inválido" });
        return;
      }
      if (room.players.some((player) => player.id === socket.id)) {
        ack?.({ ok: true });
        return;
      }

      joinPlayer(room, socket.id, { name, mode, isOwner: payload?.isOwner });
      socket.join(room.id);
      syncState(room);
      broadcast(io, room);
      ack?.({ ok: true });
    }
  );
};
