import http from "http";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { registerRoomHandlers } from "./events";

const app = express();
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : true,
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : true,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  registerRoomHandlers(io, socket);
});

const PORT = Number(process.env.PORT) || 3001;

server.listen(PORT, () => {
  console.log(`[api] Planning Poker API escuchando en http://localhost:${PORT}`);
});
