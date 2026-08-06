import type { Server, Socket } from "socket.io";
import { ALL_POOLS, validateGameName, validateUserName } from "@planning-poker/shared";
import type {
  AckResponse,
  Card,
  CardResult,
  ChangePoolPayload,
  ChooseCardPayload,
  JoinRoomPayload,
  Role,
  Room,
  UpdateRolesPayload,
} from "@planning-poker/shared";
import {
  createRoom,
  deleteRoom,
  getRoom,
  getRoomBySocketId,
  isCreator,
  registerCreator,
} from "./rooms";

const broadcast = (io: Server, room: Room): void => {
  io.to(room.id).emit("room-state", room);
};

/** Recalcula si todos los jugadores ya votaron (no aplica tras revelar). */
const syncState = (room: Room): void => {
  if (room.state === "revealed_cards") return;
  const voters = room.players.filter((player) =>
    player.roles.includes("player")
  );
  room.state =
    voters.length > 0 && voters.every((player) => typeof player.voted === "object")
      ? "ready_to_show_cards"
      : "started";
};

const recomputeSelectedCards = (room: Room): void => {
  room.selectedCards = room.players
    .filter((player) => typeof player.voted === "object")
    .map((player) => player.voted as Card);
};

const requireOwner = (
  room: Room,
  socket: Socket,
  ack?: (response: AckResponse) => void
): boolean => {
  if (room.ownerIds.includes(socket.id)) return true;
  ack?.({ ok: false, error: "Solo el administrador puede realizar esta acción" });
  return false;
};

export const registerRoomHandlers = (io: Server, socket: Socket): void => {
  socket.on(
    "create-room",
    (payload: { name?: string } | undefined, ack?: (response: AckResponse) => void) => {
      const name = payload?.name?.trim() ?? "";
      if (!validateGameName(name)) {
        ack?.({
          ok: false,
          error:
            "El nombre debe tener entre 5 y 20 caracteres, sin caracteres especiales y máximo 2 números.",
        });
        return;
      }
      const room = createRoom(name);
      registerCreator(room.id, socket.id);
      ack?.({ ok: true, roomId: room.id, name: room.name });
    }
  );

  socket.on(
    "room-exists",
    (payload: { roomId?: string } | undefined, ack?: (response: AckResponse) => void) => {
      ack?.({ ok: true, exists: Boolean(getRoom(payload?.roomId)) });
    }
  );

  socket.on(
    "join-room",
    (payload: JoinRoomPayload | undefined, ack?: (response: AckResponse) => void) => {
      const room = getRoom(payload?.roomId);
      if (!room) {
        ack?.({ ok: false, error: "La sala no existe" });
        return;
      }
      const name = payload?.name?.trim() ?? "";
      if (!validateUserName(name)) {
        ack?.({ ok: false, error: "Nombre inválido" });
        return;
      }
      const mode = payload?.mode;
      if (mode !== "player" && mode !== "viwer") {
        ack?.({ ok: false, error: "Modo de visualización inválido" });
        return;
      }
      if (room.players.some((player) => player.id === socket.id)) {
        ack?.({ ok: true });
        return;
      }

      const roles: Role[] = mode === "viwer" ? ["viwer"] : ["player"];
      const recoversOwner =
        isCreator(room.id, socket.id) ||
        (payload?.isOwner === true && room.ownerIds.length === 0);
      if (recoversOwner && !room.ownerIds.includes(socket.id)) {
        roles.push("owner");
        room.ownerIds.push(socket.id);
      }

      room.players.push({ id: socket.id, name, roles, voted: false });
      socket.join(room.id);
      syncState(room);
      broadcast(io, room);
      ack?.({ ok: true });
    }
  );

  socket.on(
    "choose-card",
    (payload: ChooseCardPayload | undefined, ack?: (response: AckResponse) => void) => {
      const room = getRoomBySocketId(socket.id);
      if (!room) {
        ack?.({ ok: false, error: "No estás en una sala" });
        return;
      }
      const player = room.players.find((p) => p.id === socket.id);
      if (!player || !player.roles.includes("player")) {
        ack?.({ ok: false, error: "Solo los jugadores pueden elegir carta" });
        return;
      }
      if (room.state === "revealed_cards") {
        ack?.({ ok: false, error: "Las cartas ya fueron reveladas" });
        return;
      }
      if (typeof player.voted === "object") {
        ack?.({ ok: false, error: "Ya elegiste una carta" });
        return;
      }
      const card = room.poolCards.find((c) => c.id === payload?.cardId);
      if (!card) {
        ack?.({ ok: false, error: "Carta no válida" });
        return;
      }
      player.voted = card;
      recomputeSelectedCards(room);
      syncState(room);
      broadcast(io, room);
      ack?.({ ok: true });
    }
  );

  socket.on(
    "reveal-cards",
    (_payload: undefined, ack?: (response: AckResponse) => void) => {
      const room = getRoomBySocketId(socket.id);
      if (!room) {
        ack?.({ ok: false, error: "No estás en una sala" });
        return;
      }
      if (!requireOwner(room, socket, ack)) return;

      const votedPlayers = room.players.filter(
        (player) =>
          player.roles.includes("player") && typeof player.voted === "object"
      );
      const count: Record<string, CardResult> = {};
      let sumValues = 0;
      votedPlayers.forEach((player) => {
        const card = player.voted as Card;
        if (count[card.id]) {
          count[card.id].votes++;
        } else {
          count[card.id] = { ...card, votes: 1 };
        }
        sumValues += card.value;
      });

      room.results = {
        count: Object.values(count),
        avarage: votedPlayers.length ? sumValues / votedPlayers.length : 0,
      };
      room.state = "revealed_cards";
      broadcast(io, room);
      ack?.({ ok: true });
    }
  );

  socket.on(
    "reset-game",
    (_payload: undefined, ack?: (response: AckResponse) => void) => {
      const room = getRoomBySocketId(socket.id);
      if (!room) {
        ack?.({ ok: false, error: "No estás en una sala" });
        return;
      }
      if (!requireOwner(room, socket, ack)) return;

      room.state = "started";
      room.selectedCards = [];
      room.results = { count: [], avarage: 0 };
      room.players = room.players.map((player) => ({
        ...player,
        voted: false,
      }));
      broadcast(io, room);
      ack?.({ ok: true });
    }
  );

  socket.on(
    "change-pool",
    (payload: ChangePoolPayload | undefined, ack?: (response: AckResponse) => void) => {
      const room = getRoomBySocketId(socket.id);
      if (!room) {
        ack?.({ ok: false, error: "No estás en una sala" });
        return;
      }
      if (!requireOwner(room, socket, ack)) return;
      if (room.state === "revealed_cards") {
        ack?.({
          ok: false,
          error: "Reinicia la partida antes de cambiar el modo de puntajes.",
        });
        return;
      }
      const poolKey = payload?.poolKey ?? "";
      if (!ALL_POOLS[poolKey]) {
        ack?.({ ok: false, error: "Modo de puntajes inválido" });
        return;
      }
      room.poolKey = poolKey;
      room.poolCards = ALL_POOLS[poolKey];
      room.selectedCards = [];
      room.players = room.players.map((player) => ({
        ...player,
        voted: false,
      }));
      syncState(room);
      broadcast(io, room);
      ack?.({ ok: true });
    }
  );

  socket.on(
    "change-mode",
    (_payload: undefined, ack?: (response: AckResponse) => void) => {
      const room = getRoomBySocketId(socket.id);
      if (!room) {
        ack?.({ ok: false, error: "No estás en una sala" });
        return;
      }
      const player = room.players.find((p) => p.id === socket.id);
      if (!player) {
        ack?.({ ok: false, error: "Jugador no encontrado" });
        return;
      }
      const wasViwer = player.roles.includes("viwer");
      player.roles = wasViwer ? ["player"] : ["viwer"];
      if (!wasViwer) {
        player.voted = false;
        recomputeSelectedCards(room);
      }
      syncState(room);
      broadcast(io, room);
      ack?.({ ok: true });
    }
  );

  socket.on(
    "update-roles",
    (payload: UpdateRolesPayload | undefined, ack?: (response: AckResponse) => void) => {
      const room = getRoomBySocketId(socket.id);
      if (!room) {
        ack?.({ ok: false, error: "No estás en una sala" });
        return;
      }
      if (!requireOwner(room, socket, ack)) return;

      const target = room.players.find((p) => p.id === payload?.targetSocketId);
      if (!target) {
        ack?.({ ok: false, error: "El jugador objetivo no está en la sala" });
        return;
      }
      if (!target.roles.includes("owner")) {
        target.roles.push("owner");
        room.ownerIds.push(target.id);
        broadcast(io, room);
      }
      ack?.({ ok: true });
    }
  );

  socket.on("disconnect", () => {
    const room = getRoomBySocketId(socket.id);
    if (!room) return;
    room.players = room.players.filter((player) => player.id !== socket.id);
    room.ownerIds = room.ownerIds.filter((id) => id !== socket.id);

    if (room.players.length === 0) {
      deleteRoom(room.id);
      return;
    }
    recomputeSelectedCards(room);
    syncState(room);
    broadcast(io, room);
  });
};
