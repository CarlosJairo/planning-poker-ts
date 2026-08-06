import { ALL_POOLS } from "@planning-poker/shared";
import type { Card, CardResult, Player, Room } from "@planning-poker/shared";
import { recomputeSelectedCards, syncState } from "./state-service";

/** Registra el voto de un jugador y recalcula el estado de la sala. */
export const voteFor = (room: Room, player: Player, card: Card): void => {
  player.voted = card;
  recomputeSelectedCards(room);
  syncState(room);
};

/** Cuenta los votos emitidos y revela las cartas. */
export const revealVotes = (room: Room): void => {
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
};

/** Limpia votos y resultados para empezar una nueva votación. */
export const resetGame = (room: Room): void => {
  room.state = "started";
  room.selectedCards = [];
  room.results = { count: [], avarage: 0 };
  room.players = room.players.map((player) => ({
    ...player,
    voted: false,
  }));
};

/** Cambia el modo de puntajes y resetea los votos. */
export const switchPool = (room: Room, poolKey: string): void => {
  room.poolKey = poolKey;
  room.poolCards = ALL_POOLS[poolKey];
  room.selectedCards = [];
  room.players = room.players.map((player) => ({
    ...player,
    voted: false,
  }));
  syncState(room);
};

/** Alterna el modo jugador/espectador conservando el rol de owner. */
export const togglePlayerMode = (room: Room, player: Player): void => {
  const wasViwer = player.roles.includes("viwer");
  const hadOwner = player.roles.includes("owner");
  player.roles = wasViwer ? ["player"] : ["viwer"];
  if (hadOwner) {
    player.roles.push("owner");
  }
  if (!wasViwer) {
    player.voted = false;
    recomputeSelectedCards(room);
  }
  syncState(room);
};
