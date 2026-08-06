import type { Socket } from "socket.io";
import type { AckResponse, Room } from "@planning-poker/shared";
import { getRoomBySocketId } from "../../rooms";

/** Devuelve la sala del socket o responde el error y retorna undefined. */
export const getRoomForSocket = (
  socket: Socket,
  ack?: (response: AckResponse) => void
): Room | undefined => {
  const room = getRoomBySocketId(socket.id);
  if (!room) {
    ack?.({ ok: false, error: "No estás en una sala" });
  }
  return room;
};

/** Asegura que el socket pertenece al admin de la sala. */
export const requireOwner = (
  room: Room,
  socket: Socket,
  ack?: (response: AckResponse) => void
): boolean => {
  if (room.ownerIds.includes(socket.id)) return true;
  ack?.({ ok: false, error: "Solo el administrador puede realizar esta acción" });
  return false;
};
