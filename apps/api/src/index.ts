import { createApp } from "./app";

const { server } = createApp();

const PORT = Number(process.env.PORT) || 3001;

server.listen(PORT, () => {
  console.log(`[api] Planning Poker API running`);
});
