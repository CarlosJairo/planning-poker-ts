import { randomBytes } from "crypto";
import { ALL_POOLS } from "@planning-poker/shared";
import type { Room } from "@planning-poker/shared";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const randomId = (length: number): string =>
  Array.from(randomBytes(length))
    .map((byte) => ALPHABET[byte % ALPHABET.length])
    .join("");

const rooms = new Map<string, Room>();
const creators = new Map<string, string>();

export const createRoom = (name: string): Room => {
  const id = randomId(6);
  const room: Room = {
    id,
    name,
    state: "started",
    poolKey: "fibonacci",
    poolCards: ALL_POOLS.fibonacci,
    players: [],
    ownerIds: [],
    selectedCards: [],
    results: { count: [], avarage: 0 },
  };
  rooms.set(id, room);
  return room;
};

export const getRoom = (roomId: string | undefined): Room | undefined =>
  rooms.get(roomId ?? "");

export const getRoomBySocketId = (socketId: string): Room | undefined =>
  [...rooms.values()].find((room) =>
    room.players.some((player) => player.id === socketId)
  );

export const deleteRoom = (roomId: string): void => {
  rooms.delete(roomId);
  creators.delete(roomId);
};

export const registerCreator = (roomId: string, socketId: string): void => {
  creators.set(roomId, socketId);
};

export const isCreator = (roomId: string, socketId: string): boolean =>
  creators.get(roomId) === socketId;
