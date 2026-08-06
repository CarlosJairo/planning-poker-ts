import type { Server, Socket } from "socket.io";
import { registerChangeMode } from "./handlers/change-mode";
import { registerChangePool } from "./handlers/change-pool";
import { registerChooseCard } from "./handlers/choose-card";
import { registerCreateRoom } from "./handlers/create-room";
import { registerDisconnect } from "./handlers/disconnect";
import { registerJoinRoom } from "./handlers/join-room";
import { registerResetGame } from "./handlers/reset-game";
import { registerRevealCards } from "./handlers/reveal-cards";
import { registerRoomExists } from "./handlers/room-exists";
import { registerUpdateRoles } from "./handlers/update-roles";

/** Registra todos los handlers de Socket.io (cada evento vive en su propio archivo). */
export const registerRoomHandlers = (io: Server, socket: Socket): void => {
  registerCreateRoom(io, socket);
  registerRoomExists(io, socket);
  registerJoinRoom(io, socket);
  registerChooseCard(io, socket);
  registerRevealCards(io, socket);
  registerResetGame(io, socket);
  registerChangePool(io, socket);
  registerChangeMode(io, socket);
  registerUpdateRoles(io, socket);
  registerDisconnect(io, socket);
};
