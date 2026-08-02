import http from "http";
import type { Server as HttpServer } from "http";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { registerRoomHandlers } from "./events";

const buildCorsOrigin = ():
  | boolean
  | ((
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) => void) => {
  const list =
    process.env.ALLOWED_ORIGINS?.split(",")
      .map((entry) => entry.trim())
      .filter(Boolean) ?? null;
  if (!list) {
    return true;
  }
  return (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }
    const allowed = list.some((pattern) => {
      if (pattern === "*") return true;
      if (pattern.includes("*.")) {
        return origin.endsWith(pattern.slice(pattern.indexOf("*.") + 1));
      }
      return origin === pattern;
    });
    if (allowed) {
      callback(null, true);
    } else {
      callback(new Error("Origin not allowed by CORS"));
    }
  };
};

/** Crea el server HTTP de Express (health + CORS). */
export const createHttpServer = (): HttpServer => {
  const app = express();
  app.use(cors({ origin: buildCorsOrigin() }));
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  return http.createServer(app);
};

/** Adjunta Socket.io al server y registra los handlers de sala. */
export const attachSocketIo = (server: HttpServer): Server => {
  const io = new Server(server, {
    cors: {
      origin: buildCorsOrigin(),
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    registerRoomHandlers(io, socket);
  });

  return io;
};

/** Ensambla la aplicación completa (server + socket.io). */
export const createApp = (): { server: HttpServer; io: Server } => {
  const server = createHttpServer();
  const io = attachSocketIo(server);
  return { server, io };
};
