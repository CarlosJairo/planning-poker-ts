import type { Card, Room } from "@planning-poker/shared";

/** Recalcula si todos los jugadores ya votaron (no aplica tras revelar). */
export const syncState = (room: Room): void => {
  if (room.state === "revealed_cards") return;
  const voters = room.players.filter((player) =>
    player.roles.includes("player")
  );
  room.state =
    voters.length > 0 && voters.every((player) => typeof player.voted === "object")
      ? "ready_to_show_cards"
      : "started";
};

/** Vuelve a armar selectedCards a partir de los votos emitidos. */
export const recomputeSelectedCards = (room: Room): void => {
  room.selectedCards = room.players
    .filter((player) => typeof player.voted === "object")
    .map((player) => player.voted as Card);
};
