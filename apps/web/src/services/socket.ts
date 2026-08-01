import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import { store } from "../app/store";
import { setRoomState } from "../reducers/game/gameSlice";
import {
  clearCurrentUser,
  setCurrentUserFromRoom,
} from "../reducers/user/userSlice";
import type {
  AckResponse,
  ChangePoolPayload,
  ChooseCardPayload,
  JoinRoomPayload,
  Room,
  UpdateRolesPayload,
} from "@planning-poker/shared";

declare const __WS_URL__: string | undefined;

const WS_URL =
  typeof __WS_URL__ !== "undefined" && __WS_URL__ ? __WS_URL__ : undefined;

export const socket: Socket = io(WS_URL);

const emitWithAck = (event: string, payload?: unknown): Promise<AckResponse> =>
  new Promise<AckResponse>((resolve) => {
    socket.emit(event, payload, (response: AckResponse) => resolve(response));
  });

export const createRoom = (name: string): Promise<AckResponse> =>
  emitWithAck("create-room", { name });

export const joinRoom = (payload: JoinRoomPayload): Promise<AckResponse> =>
  emitWithAck("join-room", payload);

export const chooseCard = (cardId: string): Promise<AckResponse> =>
  emitWithAck("choose-card", { cardId } satisfies ChooseCardPayload);

export const revealCards = (): Promise<AckResponse> =>
  emitWithAck("reveal-cards");

export const resetGame = (): Promise<AckResponse> => emitWithAck("reset-game");

export const changePool = (poolKey: string): Promise<AckResponse> =>
  emitWithAck("change-pool", { poolKey } satisfies ChangePoolPayload);

export const changeMode = (): Promise<AckResponse> =>
  emitWithAck("change-mode");

export const updateRoles = (
  targetSocketId: string
): Promise<AckResponse> =>
  emitWithAck("update-roles", { targetSocketId } satisfies UpdateRolesPayload);

// Estado canónico del servidor -> Redux
socket.on("room-state", (room: Room) => {
  store.dispatch(setRoomState(room));
  const me = room.players.find((player) => player.id === socket.id);
  if (me) {
    store.dispatch(
      setCurrentUserFromRoom({
        id: me.id,
        name: me.name,
        roles: me.roles,
        voted: me.voted,
      })
    );
  } else {
    store.dispatch(clearCurrentUser());
  }
});

socket.on("room-error", (error: { message: string }) => {
  console.error("[planning-poker] error:", error.message);
});

export default socket;
