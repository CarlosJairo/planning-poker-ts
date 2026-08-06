import type { Server, Socket } from "socket.io";
import { validateGameName } from "@planning-poker/shared";
import type { AckResponse } from "@planning-poker/shared";
import { createRoom, registerCreator } from "../../rooms";

export const registerCreateRoom = (_io: Server, socket: Socket): void => {
  socket.on(
    "create-room",
    (payload: { name?: string } | undefined, ack?: (response: AckResponse) => void) => {
      const name = payload?.name?.trim() ?? "";
      if (!validateGameName(name)) {
        ack?.({
          ok: false,
          error:
            "El nombre debe tener entre 5 y 20 caracteres, sin caracteres especiales.",
        });
        return;
      }
      const room = createRoom(name);
      registerCreator(room.id, socket.id);
      ack?.({ ok: true, roomId: room.id, name: room.name });
    }
  );
};
