import type { Player, Role, Room, ViewMode } from "@planning-poker/shared";
import { cancelOwnerTransfer, isCreator } from "../../rooms";

/** Agrega un jugador a la sala, recuperando el rol de owner si corresponde. */
export const joinPlayer = (
  room: Room,
  socketId: string,
  input: { name: string; mode: ViewMode; isOwner?: boolean }
): void => {
  const roles: Role[] = input.mode === "viwer" ? ["viwer"] : ["player"];
  const recoversOwner =
    isCreator(room.id, socketId) ||
    (input.isOwner === true && room.ownerIds.length === 0);
  if (recoversOwner && !room.ownerIds.includes(socketId)) {
    cancelOwnerTransfer(room.id);
    roles.push("owner");
    room.ownerIds.push(socketId);
  }
  room.players.push({ id: socketId, name: input.name, roles, voted: false });
};

/** Quita un jugador de la sala y reporta si era owner. */
export const removePlayer = (
  room: Room,
  socketId: string
): { wasOwner: boolean } => {
  const wasOwner = room.ownerIds.includes(socketId);
  room.players = room.players.filter((player) => player.id !== socketId);
  room.ownerIds = room.ownerIds.filter((id) => id !== socketId);
  return { wasOwner };
};

/** Promueve a un miembro a owner y devuelve true si hubo cambio. */
export const promoteToOwner = (room: Room, target: Player): boolean => {
  if (target.roles.includes("owner")) return false;
  target.roles.push("owner");
  room.ownerIds.push(target.id);
  return true;
};

/** Transfiere el admin a un jugador (o al primer miembro) y lo devuelve. */
export const transferOwnership = (room: Room): Player | undefined => {
  const newOwner =
    room.players.find((player) => player.roles.includes("player")) ??
    room.players[0];
  if (!newOwner) return undefined;
  newOwner.roles.push("owner");
  room.ownerIds.push(newOwner.id);
  return newOwner;
};
