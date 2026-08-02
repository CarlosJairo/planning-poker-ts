import type { AddressInfo } from "net";
import type { Server } from "socket.io";
import type { Socket } from "socket.io-client";
import { io as createClient } from "socket.io-client";
import type { AckResponse, Room } from "@planning-poker/shared";
import { createApp } from "../app";

let server: Awaited<ReturnType<typeof createApp>>["server"];
let ioServer: Server;
let baseUrl: string;
const clients: Socket[] = [];

beforeAll(async () => {
  const app = createApp();
  server = app.server;
  ioServer = app.io;
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${port}`;
});

afterAll(async () => {
  clients.forEach((client) => client.disconnect());
  await new Promise<void>((resolve) => ioServer.close(() => resolve()));
  await new Promise<void>((resolve) => {
    server.close(() => resolve());
    server.closeAllConnections();
  });
});

const connect = (): Promise<Socket> =>
  new Promise((resolve, reject) => {
    const socket = createClient(baseUrl, {
      transports: ["websocket"],
      reconnection: false,
      timeout: 2000,
    });
    clients.push(socket);
    socket.on("connect", () => resolve(socket));
    socket.on("connect_error", (err) => reject(err));
  });

const emit = <T = AckResponse>(
  socket: Socket,
  event: string,
  payload?: unknown
): Promise<T> =>
  new Promise((resolve) => {
    socket.emit(event, payload, (response: T) => resolve(response));
  });

const waitForRoomState = (
  socket: Socket,
  roomId: string,
  predicate: (room: Room) => boolean,
  timeout = 3000
): Promise<Room> =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("timeout waiting for room-state")),
      timeout
    );
    const handler = (room: Room) => {
      if (room.id !== roomId) return;
      if (predicate(room)) {
        clearTimeout(timer);
        socket.off("room-state", handler);
        resolve(room);
      }
    };
    socket.on("room-state", handler);
  });

interface PlayerOpts {
  name: string;
  mode: "player" | "viwer";
}

const createRoom = async (
  gameName = "SprintTwo"
): Promise<{ roomId: string; creator: Socket }> => {
  const creator = await connect();
  const created = await emit<AckResponse>(creator, "create-room", {
    name: gameName,
  });
  if (!created.ok || !created.roomId) {
    throw new Error("failed to create room");
  }
  return { roomId: created.roomId, creator };
};

const joinRoom = async (
  socket: Socket,
  roomId: string,
  { name, mode }: PlayerOpts
): Promise<AckResponse> =>
  emit<AckResponse>(socket, "join-room", { roomId, name, mode });

const joinPlayer = async (
  roomId: string,
  { name, mode }: PlayerOpts
): Promise<Socket> => {
  const socket = await connect();
  const ack = await joinRoom(socket, roomId, { name, mode });
  if (!ack.ok) {
    throw new Error(`join failed: ${ack.error}`);
  }
  return socket;
};

describe("Room creation and join (HU1, HU2, HU8)", () => {
  test("creates a room with a unique id and the creator joins as owner", async () => {
    const creator = await connect();
    const created = await emit<AckResponse>(creator, "create-room", {
      name: "SprintTwo",
    });

    expect(created.ok).toBe(true);
    expect(created.roomId).toMatch(/^[A-Z2-9]{6}$/);
    const roomId = created.roomId as string;

    const joined = waitForRoomState(creator, roomId, (r) => r.players.length === 1);
    const ack = await joinRoom(creator, roomId, {
      name: "CarlosAdmin",
      mode: "player",
    });
    expect(ack.ok).toBe(true);
    const room = await joined;

    expect(room.players).toHaveLength(1);
    expect(room.ownerIds).toContain(creator.id);
    expect(room.players[0].roles).toEqual(expect.arrayContaining(["owner", "player"]));

    creator.disconnect();
  });

  test("rejects an invalid game name and an invalid user name", async () => {
    const creator = await connect();
    const invalid = await emit<AckResponse>(creator, "create-room", {
      name: "AB 123!",
    });
    expect(invalid.ok).toBe(false);

    const created = await emit<AckResponse>(creator, "create-room", {
      name: "SprintTwo",
    });
    const roomId = created.roomId as string;
    const ack = await emit<AckResponse>(creator, "join-room", {
      roomId,
      name: "123",
      mode: "player",
    });
    expect(ack.ok).toBe(false);

    creator.disconnect();
  });

  test("join-room rejects a non-existent room", async () => {
    const socket = await connect();
    const ack = await emit<AckResponse>(socket, "join-room", {
      roomId: "NOPE99",
      name: "CarlosAdmin",
      mode: "player",
    });
    expect(ack.ok).toBe(false);
    socket.disconnect();
  });
});

describe("Choose card (HU4, HU10)", () => {
  test("only players can choose a card", async () => {
    const { roomId, creator } = await createRoom();
    await joinRoom(creator, roomId, { name: "CarlosAdmin", mode: "player" });

    const viewer = await joinPlayer(roomId, { name: "Espectador", mode: "viwer" });
    const ack = await emit<AckResponse>(viewer, "choose-card", { cardId: "1" });
    expect(ack.ok).toBe(false);
    expect(ack.error).toMatch(/jugadores/i);

    viewer.disconnect();
    creator.disconnect();
  });

  test("a player cannot choose a card that does not exist", async () => {
    const { roomId, creator } = await createRoom();
    await joinRoom(creator, roomId, { name: "CarlosAdmin", mode: "player" });

    const ack = await emit<AckResponse>(creator, "choose-card", {
      cardId: "no-existe",
    });
    expect(ack.ok).toBe(false);

    creator.disconnect();
  });

  test("a player cannot choose twice", async () => {
    const { roomId, creator } = await createRoom();
    await joinRoom(creator, roomId, { name: "CarlosAdmin", mode: "player" });

    const first = await emit<AckResponse>(creator, "choose-card", { cardId: "1" });
    expect(first.ok).toBe(true);

    const second = await emit<AckResponse>(creator, "choose-card", { cardId: "2" });
    expect(second.ok).toBe(false);
    expect(second.error).toMatch(/ya/i);

    creator.disconnect();
  });

  test("state becomes ready_to_show_cards when all players vote", async () => {
    const { roomId, creator } = await createRoom();
    await joinRoom(creator, roomId, { name: "CarlosAdmin", mode: "player" });

    const player2 = await joinPlayer(roomId, { name: "PlayerTwo", mode: "player" });
    const player3 = await joinPlayer(roomId, { name: "ViewerOne", mode: "viwer" });

    const ready = waitForRoomState(
      creator,
      roomId,
      (r) => r.state === "ready_to_show_cards"
    );
    const ack1 = await emit<AckResponse>(creator, "choose-card", { cardId: "1" });
    expect(ack1.ok).toBe(true);
    const ack2 = await emit<AckResponse>(player2, "choose-card", { cardId: "3" });
    expect(ack2.ok).toBe(true);

    const room = await ready;
    expect(room.state).toBe("ready_to_show_cards");
    // Los espectadores no votan y el estado no requiere su voto
    expect(room.players.find((p) => p.id === player3.id)?.voted).toBe(false);

    player2.disconnect();
    player3.disconnect();
    creator.disconnect();
  });
});

describe("Reveal cards (HU5)", () => {
  test("computes count and average excluding spectators", async () => {
    const { roomId, creator } = await createRoom();
    await joinRoom(creator, roomId, { name: "CarlosAdmin", mode: "player" });

    const player2 = await joinPlayer(roomId, { name: "PlayerTwo", mode: "player" });
    await joinPlayer(roomId, { name: "ViewerOne", mode: "viwer" });

    const ready = waitForRoomState(
      creator,
      roomId,
      (r) => r.state === "ready_to_show_cards"
    );
    await emit<AckResponse>(creator, "choose-card", { cardId: "1" }); // value 1
    await emit<AckResponse>(player2, "choose-card", { cardId: "4" }); // value 8
    await ready;

    const revealed = waitForRoomState(
      creator,
      roomId,
      (r) => r.state === "revealed_cards"
    );
    const ack = await emit<AckResponse>(creator, "reveal-cards");
    expect(ack.ok).toBe(true);
    const room = await revealed;

    expect(room.results.count).toHaveLength(2);
    const total = room.results.count.reduce((sum, c) => sum + c.votes, 0);
    expect(total).toBe(2);
    // (1 + 8) / 2 = 4.5 -> el espectador no cuenta
    expect(room.results.avarage).toBeCloseTo(4.5);

    player2.disconnect();
    creator.disconnect();
  });

  test("only the owner can reveal cards", async () => {
    const { roomId, creator } = await createRoom();
    await joinRoom(creator, roomId, { name: "CarlosAdmin", mode: "player" });

    const player2 = await joinPlayer(roomId, { name: "PlayerTwo", mode: "player" });

    const ready = waitForRoomState(
      creator,
      roomId,
      (r) => r.state === "ready_to_show_cards"
    );
    await emit<AckResponse>(creator, "choose-card", { cardId: "1" });
    await emit<AckResponse>(player2, "choose-card", { cardId: "3" });
    await ready;

    const ack = await emit<AckResponse>(player2, "reveal-cards");
    expect(ack.ok).toBe(false);

    player2.disconnect();
    creator.disconnect();
  });
});

describe("Reset game (HU6)", () => {
  test("clears votes and results, and players can vote again", async () => {
    const { roomId, creator } = await createRoom();
    await joinRoom(creator, roomId, { name: "CarlosAdmin", mode: "player" });

    const player2 = await joinPlayer(roomId, { name: "PlayerTwo", mode: "player" });

    const ready = waitForRoomState(
      creator,
      roomId,
      (r) => r.state === "ready_to_show_cards"
    );
    await emit<AckResponse>(creator, "choose-card", { cardId: "1" });
    await emit<AckResponse>(player2, "choose-card", { cardId: "4" });
    await ready;

    const revealed = waitForRoomState(
      creator,
      roomId,
      (r) => r.state === "revealed_cards"
    );
    await emit<AckResponse>(creator, "reveal-cards");
    await revealed;

    const reset = waitForRoomState(creator, roomId, (r) => r.state === "started");
    const ack = await emit<AckResponse>(creator, "reset-game");
    expect(ack.ok).toBe(true);
    const room = await reset;

    expect(room.state).toBe("started");
    expect(room.selectedCards).toHaveLength(0);
    expect(room.results.count).toHaveLength(0);
    expect(room.players.every((p) => p.voted === false)).toBe(true);

    const revote = await emit<AckResponse>(player2, "choose-card", { cardId: "2" });
    expect(revote.ok).toBe(true);

    player2.disconnect();
    creator.disconnect();
  });

  test("only the owner can reset the game", async () => {
    const { roomId, creator } = await createRoom();
    await joinRoom(creator, roomId, { name: "CarlosAdmin", mode: "player" });
    const player2 = await joinPlayer(roomId, { name: "PlayerTwo", mode: "player" });

    const ack = await emit<AckResponse>(player2, "reset-game");
    expect(ack.ok).toBe(false);

    player2.disconnect();
    creator.disconnect();
  });
});
