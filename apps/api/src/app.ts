import http from "http";
import type { Server as HttpServer } from "http";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { registerRoomHandlers } from "./events";

const resolveOrigins = (): string[] | boolean => {
  if (process.env.ALLOWED_ORIGINS) {
    return process.env.ALLOWED_ORIGINS.split(",");
  }
  return true;
};

/** Crea el server HTTP de Express (health + CORS). */
export const createHttpServer = (): HttpServer => {
  const app = express();
  app.use(cors({ origin: resolveOrigins() }));
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
      origin: resolveOrigins(),
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
