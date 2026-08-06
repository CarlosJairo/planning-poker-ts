import type { Server } from "socket.io";
import type { Room } from "@planning-poker/shared";

/** Emite el estado de la sala a todos los sockets conectados a ella. */
export const broadcast = (io: Server, room: Room): void => {
  io.to(room.id).emit("room-state", room);
};
