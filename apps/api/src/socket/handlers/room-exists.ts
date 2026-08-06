import type { Server, Socket } from "socket.io";
import type { AckResponse } from "@planning-poker/shared";
import { getRoom } from "../../rooms";

export const registerRoomExists = (_io: Server, socket: Socket): void => {
  socket.on(
    "room-exists",
    (payload: { roomId?: string } | undefined, ack?: (response: AckResponse) => void) => {
      ack?.({ ok: true, exists: Boolean(getRoom(payload?.roomId)) });
    }
  );
};
