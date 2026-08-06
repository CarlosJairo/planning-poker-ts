import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import { store } from "../app/store";
import { setRoomState } from "../reducers/game/gameSlice";
import {
  clearCurrentUser,
  setCurrentUserFromRoom,
} from "../reducers/user/userSlice";
import { showToast } from "../reducers/toast/toastSlice";
import type {
  AckResponse,
  ChangePoolPayload,
  ChooseCardPayload,
  JoinRoomPayload,
  Room,
  UpdateRolesPayload,
  ViewMode,
} from "@planning-poker/shared";

declare const __WS_URL__: string | undefined;

const WS_URL =
  typeof __WS_URL__ !== "undefined" && __WS_URL__ ? __WS_URL__ : undefined;

export const socket: Socket = io(WS_URL);

const JOIN_KEY = "planning-poker:join";
const CREATED_KEY = "planning-poker:created";

export interface StoredJoin {
  roomId: string;
  name: string;
  mode: ViewMode;
  isOwner?: boolean;
}

const emitWithAck = (event: string, payload?: unknown): Promise<AckResponse> =>
  new Promise<AckResponse>((resolve) => {
    socket.emit(event, payload, (response: AckResponse) => resolve(response));
  });

/** Guarda la identidad de la pestaña para re-conectarse tras un refresh. */
export const persistJoin = (join: StoredJoin): void => {
  sessionStorage.setItem(JOIN_KEY, JSON.stringify(join));
};

export const getJoin = (): StoredJoin | null => {
  try {
    const raw = sessionStorage.getItem(JOIN_KEY);
    return raw ? (JSON.parse(raw) as StoredJoin) : null;
  } catch {
    return null;
  }
};

export const clearJoin = (): void => {
  sessionStorage.removeItem(JOIN_KEY);
};

/** Marca la sala creada desde esta pestaña (para recuperar el rol de owner). */
export const markCreatedRoom = (roomId: string): void => {
  sessionStorage.setItem(CREATED_KEY, roomId);
};

export const getCreatedRoomId = (): string | null =>
  sessionStorage.getItem(CREATED_KEY);

export const createRoom = async (name: string): Promise<AckResponse> => {
  const response = await emitWithAck("create-room", { name });
  if (response.ok && response.roomId) {
    markCreatedRoom(response.roomId);
  }
  return response;
};

export const roomExists = (roomId: string): Promise<AckResponse> =>
  emitWithAck("room-exists", { roomId });

export const joinRoom = async (
  payload: JoinRoomPayload
): Promise<AckResponse> => {
  const response = await emitWithAck("join-room", payload);
  if (response.ok) {
    persistJoin({
      roomId: payload.roomId,
      name: payload.name,
      mode: payload.mode,
      isOwner: payload.isOwner,
    });
  }
  return response;
};

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
    const previous = store.getState().user;

    if (previous.id === socket.id) {
      const wasOwner = previous.rolCurrentUser.includes("owner");
      const isOwner = me.roles.includes("owner");
      const wasViwer = previous.rolCurrentUser.includes("viwer");
      const isViwer = me.roles.includes("viwer");

      if (!wasOwner && isOwner) {
        store.dispatch(showToast({ message: "Te fijaron como administrador" }));
      }
      if (wasViwer !== isViwer) {
        store.dispatch(
          showToast({
            message: isViwer ? "Cambiaste a espectador" : "Ahora eres jugador",
            variant: "info",
          })
        );
      }
    }

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
