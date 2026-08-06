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
      name: "CarlosAdm",
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
      name: "CarlosAdm",
      mode: "player",
    });
    expect(ack.ok).toBe(false);
    socket.disconnect();
  });

  test("room-exists reports existing and non-existing rooms", async () => {
    const { roomId, creator } = await createRoom();
    const exists = await emit<AckResponse>(creator, "room-exists", {
      roomId,
    });
    expect(exists.ok).toBe(true);
    expect(exists.exists).toBe(true);

    const missing = await emit<AckResponse>(creator, "room-exists", {
      roomId: "NOPE99",
    });
    expect(missing.exists).toBe(false);

    creator.disconnect();
  });
});

describe("Choose card (HU4, HU10)", () => {
  test("only players can choose a card", async () => {
    const { roomId, creator } = await createRoom();
    await joinRoom(creator, roomId, { name: "CarlosAdm", mode: "player" });

    const viewer = await joinPlayer(roomId, { name: "Espectador", mode: "viwer" });
    const ack = await emit<AckResponse>(viewer, "choose-card", { cardId: "1" });
    expect(ack.ok).toBe(false);
    expect(ack.error).toMatch(/jugadores/i);

    viewer.disconnect();
    creator.disconnect();
  });

  test("a player cannot choose a card that does not exist", async () => {
    const { roomId, creator } = await createRoom();
    await joinRoom(creator, roomId, { name: "CarlosAdm", mode: "player" });

    const ack = await emit<AckResponse>(creator, "choose-card", {
      cardId: "no-existe",
    });
    expect(ack.ok).toBe(false);

    creator.disconnect();
  });

  test("a player cannot choose twice", async () => {
    const { roomId, creator } = await createRoom();
    await joinRoom(creator, roomId, { name: "CarlosAdm", mode: "player" });

    const first = await emit<AckResponse>(creator, "choose-card", { cardId: "1" });
    expect(first.ok).toBe(true);

    const second = await emit<AckResponse>(creator, "choose-card", { cardId: "2" });
    expect(second.ok).toBe(false);
    expect(second.error).toMatch(/ya/i);

    creator.disconnect();
  });

  test("state becomes ready_to_show_cards when all players vote", async () => {
    const { roomId, creator } = await createRoom();
    await joinRoom(creator, roomId, { name: "CarlosAdm", mode: "player" });

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
    await joinRoom(creator, roomId, { name: "CarlosAdm", mode: "player" });

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
    await joinRoom(creator, roomId, { name: "CarlosAdm", mode: "player" });

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
    await joinRoom(creator, roomId, { name: "CarlosAdm", mode: "player" });

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
    await joinRoom(creator, roomId, { name: "CarlosAdm", mode: "player" });
    const player2 = await joinPlayer(roomId, { name: "PlayerTwo", mode: "player" });

    const ack = await emit<AckResponse>(player2, "reset-game");
    expect(ack.ok).toBe(false);

    player2.disconnect();
    creator.disconnect();
  });
});

describe("Change mode (HU12)", () => {
  test("toggling a player to viwer clears their vote", async () => {
    const { roomId, creator } = await createRoom();
    await joinRoom(creator, roomId, { name: "CarlosAdm", mode: "player" });

    const ackVote = await emit<AckResponse>(creator, "choose-card", {
      cardId: "1",
    });
    expect(ackVote.ok).toBe(true);

    const changed = waitForRoomState(
      creator,
      roomId,
      (r) => r.players[0]?.roles.includes("viwer")
    );
    const ack = await emit<AckResponse>(creator, "change-mode");
    expect(ack.ok).toBe(true);
    const room = await changed;

    expect(room.players[0].roles).toEqual(expect.arrayContaining(["viwer"]));
    expect(room.players[0].voted).toBe(false);
    expect(room.selectedCards).toHaveLength(0);

    const reVote = await emit<AckResponse>(creator, "choose-card", { cardId: "1" });
    expect(reVote.ok).toBe(false);

    creator.disconnect();
  });

  test("toggling a viwer to player lets them vote", async () => {
    const { roomId, creator } = await createRoom();
    await joinRoom(creator, roomId, { name: "CarlosAdm", mode: "player" });
    const viewer = await joinPlayer(roomId, { name: "Espectador", mode: "viwer" });

    const changed = waitForRoomState(
      viewer,
      roomId,
      (r) => r.players.find((p) => p.id === viewer.id)?.roles.includes("player") === true
    );
    const ack = await emit<AckResponse>(viewer, "change-mode");
    expect(ack.ok).toBe(true);
    await changed;

    const vote = await emit<AckResponse>(viewer, "choose-card", { cardId: "4" });
    expect(vote.ok).toBe(true);

    viewer.disconnect();
    creator.disconnect();
  });

  test("other players see the mode change in real time", async () => {
    const { roomId, creator } = await createRoom();
    await joinRoom(creator, roomId, { name: "CarlosAdm", mode: "player" });
    const toggler = await joinPlayer(roomId, { name: "Sandra", mode: "player" });

    const changed = waitForRoomState(
      creator,
      roomId,
      (r) =>
        r.players.find((p) => p.id === toggler.id)?.roles.includes("viwer") ===
        true
    );
    const ack = await emit<AckResponse>(toggler, "change-mode");
    expect(ack.ok).toBe(true);
    const room = await changed;

    expect(room.players.find((p) => p.id === toggler.id)?.roles).toEqual(
      expect.arrayContaining(["viwer"])
    );

    toggler.disconnect();
    creator.disconnect();
  });
});

describe("Update roles / co-admin (HU13)", () => {
  test("the owner can promote another player and they keep owner on reveal", async () => {
    const { roomId, creator } = await createRoom();
    await joinRoom(creator, roomId, { name: "CarlosAdm", mode: "player" });
    const player2 = await joinPlayer(roomId, { name: "PlayerTwo", mode: "player" });

    const promoted = waitForRoomState(
      creator,
      roomId,
      (r) =>
        r.players.find((p) => p.id === player2.id)?.roles.includes("owner") === true
    );
    const ack = await emit<AckResponse>(creator, "update-roles", {
      targetSocketId: player2.id,
    });
    expect(ack.ok).toBe(true);
    const room = await promoted;

    expect(room.ownerIds).toContain(player2.id);

    const ready = waitForRoomState(
      player2,
      roomId,
      (r) => r.state === "ready_to_show_cards"
    );
    await emit<AckResponse>(creator, "choose-card", { cardId: "1" });
    await emit<AckResponse>(player2, "choose-card", { cardId: "3" });
    await ready;

    const revealed = waitForRoomState(
      player2,
      roomId,
      (r) => r.state === "revealed_cards"
    );
    const reveal = await emit<AckResponse>(player2, "reveal-cards");
    expect(reveal.ok).toBe(true);
    await revealed;

    const reset = await emit<AckResponse>(player2, "reset-game");
    expect(reset.ok).toBe(true);

    player2.disconnect();
    creator.disconnect();
  });

  test("a non-owner cannot promote anyone", async () => {
    const { roomId, creator } = await createRoom();
    await joinRoom(creator, roomId, { name: "CarlosAdm", mode: "player" });
    const player2 = await joinPlayer(roomId, { name: "PlayerTwo", mode: "player" });
    const player3 = await joinPlayer(roomId, { name: "PlayerThr", mode: "player" });

    const ack = await emit<AckResponse>(player2, "update-roles", {
      targetSocketId: player3.id,
    });
    expect(ack.ok).toBe(false);
    expect(ack.error).toMatch(/administrador/i);

    player3.disconnect();
    player2.disconnect();
    creator.disconnect();
  });
});

describe("Change pool (HU14)", () => {
  test("the owner can change the pool, resetting votes and cards", async () => {
    const { roomId, creator } = await createRoom();
    await joinRoom(creator, roomId, { name: "CarlosAdm", mode: "player" });
    const player2 = await joinPlayer(roomId, { name: "PlayerTwo", mode: "player" });

    await emit<AckResponse>(creator, "choose-card", { cardId: "1" });
    await emit<AckResponse>(player2, "choose-card", { cardId: "4" });

    const changed = waitForRoomState(
      creator,
      roomId,
      (r) => r.poolKey === "powersOfTwo"
    );
    const ack = await emit<AckResponse>(creator, "change-pool", {
      poolKey: "powersOfTwo",
    });
    expect(ack.ok).toBe(true);
    const room = await changed;

    expect(room.poolCards).toHaveLength(10);
    expect(room.selectedCards).toHaveLength(0);
    expect(room.players.every((p) => p.voted === false)).toBe(true);

    const vote = await emit<AckResponse>(creator, "choose-card", { cardId: "5" });
    expect(vote.ok).toBe(true);

    player2.disconnect();
    creator.disconnect();
  });

  test("change-pool is rejected for a non-owner, an invalid key and when revealed", async () => {
    const { roomId, creator } = await createRoom();
    await joinRoom(creator, roomId, { name: "CarlosAdm", mode: "player" });
    const player2 = await joinPlayer(roomId, { name: "PlayerTwo", mode: "player" });

    const asPlayer = await emit<AckResponse>(player2, "change-pool", {
      poolKey: "fibonacci",
    });
    expect(asPlayer.ok).toBe(false);

    const invalid = await emit<AckResponse>(creator, "change-pool", {
      poolKey: "nope",
    });
    expect(invalid.ok).toBe(false);

    const ready = waitForRoomState(
      creator,
      roomId,
      (r) => r.state === "ready_to_show_cards"
    );
    await emit<AckResponse>(creator, "choose-card", { cardId: "1" });
    await emit<AckResponse>(player2, "choose-card", { cardId: "2" });
    await ready;

    const revealed = waitForRoomState(
      creator,
      roomId,
      (r) => r.state === "revealed_cards"
    );
    await emit<AckResponse>(creator, "reveal-cards");
    await revealed;

    const afterReveal = await emit<AckResponse>(creator, "change-pool", {
      poolKey: "fibonacci",
    });
    expect(afterReveal.ok).toBe(false);
    expect(afterReveal.error).toMatch(/reinicia/i);

    player2.disconnect();
    creator.disconnect();
  });
});

describe("CORS origins (Vercel deploy)", () => {
  test("allows exact and wildcard subdomains, and denies others", async () => {
    process.env.ALLOWED_ORIGINS =
      "https://planning-poker.vercel.app,https://*.vercel.app";
    const app = createApp();
    await new Promise<void>((resolve) =>
      app.server.listen(0, "127.0.0.1", resolve)
    );
    const { port } = app.server.address() as AddressInfo;
    const url = `http://127.0.0.1:${port}/api/health`;

    const exact = await fetch(url, {
      headers: { Origin: "https://planning-poker.vercel.app" },
    });
    expect(exact.headers.get("access-control-allow-origin")).toBe(
      "https://planning-poker.vercel.app"
    );

    const preview = await fetch(url, {
      headers: { Origin: "https://planning-poker-git-main-abc123.vercel.app" },
    });
    expect(preview.headers.get("access-control-allow-origin")).toBe(
      "https://planning-poker-git-main-abc123.vercel.app"
    );

    const denied = await fetch(url, {
      headers: { Origin: "https://evil.example.com" },
    });
    expect(denied.headers.get("access-control-allow-origin")).toBeNull();

    await new Promise<void>((resolve) => app.server.close(() => resolve()));
    app.server.closeAllConnections();
    delete process.env.ALLOWED_ORIGINS;
  });
});

describe("Owner recovery on reconnection", () => {
  test("the creator regains owner when rejoining after a refresh", async () => {
    const { roomId, creator } = await createRoom();
    await joinRoom(creator, roomId, { name: "CarlosAdm", mode: "player" });
    const player2 = await joinPlayer(roomId, { name: "PlayerTwo", mode: "player" });

    creator.disconnect();
    await new Promise((resolve) => setTimeout(resolve, 50));

    const rejoined = await connect();
    const rejoinedState = waitForRoomState(
      rejoined,
      roomId,
      (r) => r.players.length === 2
    );
    const ack = await emit<AckResponse>(rejoined, "join-room", {
      roomId,
      name: "CarlosAdm",
      mode: "player",
      isOwner: true,
    });
    expect(ack.ok).toBe(true);

    const room = await rejoinedState;
    expect(room.ownerIds).toContain(rejoined.id);
    expect(room.ownerIds).not.toContain(player2.id);

    player2.disconnect();
    rejoined.disconnect();
  });
});
