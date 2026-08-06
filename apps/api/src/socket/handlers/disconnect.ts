import type { Server, Socket } from "socket.io";
import {
  deleteRoom,
  getRoom,
  getRoomBySocketId,
  scheduleOwnerTransfer,
} from "../../rooms";
import { removePlayer, transferOwnership } from "../services/room-service";
import { recomputeSelectedCards, syncState } from "../services/state-service";
import { broadcast } from "../utils/broadcast";

/** Tiempo que se espera a que el owner vuelva a reconectar antes de transferir el admin. */
const ownerTransferGraceMs = (): number =>
  Number(process.env.OWNER_TRANSFER_GRACE_MS ?? 10_000);

export const registerDisconnect = (io: Server, socket: Socket): void => {
  socket.on("disconnect", () => {
    const room = getRoomBySocketId(socket.id);
    if (!room) return;

    const { wasOwner } = removePlayer(room, socket.id);

    if (room.players.length === 0) {
      deleteRoom(room.id);
      return;
    }

    if (wasOwner && room.ownerIds.length === 0) {
      scheduleOwnerTransfer(
        room.id,
        () => {
          const pending = getRoom(room.id);
          if (!pending) return;
          if (pending.ownerIds.length > 0) return;
          if (!transferOwnership(pending)) return;
          broadcast(io, pending);
        },
        ownerTransferGraceMs()
      );
    }

    recomputeSelectedCards(room);
    syncState(room);
    broadcast(io, room);
  });
};
