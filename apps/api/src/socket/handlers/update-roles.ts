import type { Server, Socket } from "socket.io";
import type { AckResponse, UpdateRolesPayload } from "@planning-poker/shared";
import { promoteToOwner } from "../services/room-service";
import { broadcast } from "../utils/broadcast";
import { getRoomForSocket, requireOwner } from "../utils/guards";

export const registerUpdateRoles = (io: Server, socket: Socket): void => {
  socket.on(
    "update-roles",
    (payload: UpdateRolesPayload | undefined, ack?: (response: AckResponse) => void) => {
      const room = getRoomForSocket(socket, ack);
      if (!room) return;
      if (!requireOwner(room, socket, ack)) return;
      const target = room.players.find((p) => p.id === payload?.targetSocketId);
      if (!target) {
        ack?.({ ok: false, error: "El jugador objetivo no está en la sala" });
        return;
      }
      if (promoteToOwner(room, target)) {
        broadcast(io, room);
      }
      ack?.({ ok: true });
    }
  );
};
