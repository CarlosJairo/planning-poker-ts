// ============================================================================
// Tipos de dominio compartidos entre apps/api y apps/web
// ============================================================================

export interface Card {
  id: string;
  str: string;
  value: number;
}

export interface CardResult extends Card {
  votes: number;
}

export type ViewMode = "player" | "viwer";

export type Role = "owner" | "player" | "viwer";

export type GameState =
  | "no_started"
  | "started"
  | "ready_to_show_cards"
  | "revealed_cards"
  | "finished";

export interface Player {
  id: string;
  name: string;
  roles: Role[];
  voted: boolean | Card;
}

export interface Room {
  id: string;
  name: string;
  state: GameState;
  poolKey: string;
  poolCards: Card[];
  players: Player[];
  ownerIds: string[];
  selectedCards: Card[];
  results: { count: CardResult[]; avarage: number };
}

// ============================================================================
// Payloads de eventos Socket.io
// ============================================================================

export interface AckResponse {
  ok: boolean;
  roomId?: string;
  name?: string;
  error?: string;
}

export interface CreateRoomPayload {
  name: string;
}

export interface JoinRoomPayload {
  roomId: string;
  name: string;
  mode: ViewMode;
}

export interface ChooseCardPayload {
  cardId: string;
}

export interface ChangePoolPayload {
  poolKey: string;
}

export interface UpdateRolesPayload {
  targetSocketId: string;
}

// ============================================================================
// Pools de cartas (fuente de verdad para los modos de puntaje)
// ============================================================================

export const ALL_POOLS: Record<string, Card[]> = {
  fibonacci: [
    { id: "0", str: "0", value: 0 },
    { id: "1", str: "1", value: 1 },
    { id: "2", str: "3", value: 3 },
    { id: "3", str: "5", value: 5 },
    { id: "4", str: "8", value: 8 },
    { id: "5", str: "13", value: 13 },
    { id: "6", str: "21", value: 21 },
    { id: "7", str: "34", value: 34 },
    { id: "8", str: "55", value: 55 },
    { id: "9", str: "89", value: 89 },
    { id: "question", str: "?", value: 0 },
    { id: "break", str: "🍵", value: 0 },
  ],
  modifiedFibonacci: [
    { id: "0", str: "0", value: 0 },
    { id: "1", str: "1/2", value: 0.5 },
    { id: "2", str: "1", value: 1 },
    { id: "3", str: "2", value: 2 },
    { id: "4", str: "3", value: 3 },
    { id: "5", str: "5", value: 5 },
    { id: "6", str: "8", value: 8 },
    { id: "7", str: "13", value: 13 },
    { id: "8", str: "20", value: 20 },
    { id: "9", str: "40", value: 40 },
    { id: "10", str: "100", value: 100 },
    { id: "question", str: "?", value: 0 },
    { id: "break", str: "🍵", value: 0 },
  ],
  powersOfTwo: [
    { id: "0", str: "0", value: 0 },
    { id: "1", str: "1", value: 1 },
    { id: "2", str: "2", value: 2 },
    { id: "3", str: "4", value: 4 },
    { id: "4", str: "8", value: 8 },
    { id: "5", str: "16", value: 16 },
    { id: "6", str: "32", value: 32 },
    { id: "7", str: "64", value: 64 },
    { id: "question", str: "?", value: 0 },
    { id: "break", str: "🍵", value: 0 },
  ],
};

export type PoolKey = keyof typeof ALL_POOLS;

// ============================================================================
// Validaciones de nombre (server-authoritative, reutilizadas en el cliente)
// ============================================================================

const validMinMaxCharacters = (
  texto: string,
  min: number,
  max: number
): boolean => {
  return texto.length >= min && texto.length <= max;
};

const validNoCharactersSpecials = (texto: string): boolean => {
  return texto.match(/\W/) === null;
};

const maxLengtNumbersInCharacters = (
  texto: string,
  maxNumber: number
): boolean => {
  let cantNumber = 0;
  for (let i = 0; i < texto.length; i++) {
    if (Number.isInteger(parseInt(texto.charAt(i)))) {
      cantNumber++;
    }
  }
  return cantNumber <= maxNumber;
};

const noOnlyNumbersInCharacters = (texto: string): boolean => {
  return !/^([0-9])*$/.test(texto);
};

/** Nombre de la partida (HU1): 5-20 chars, sin especiales, máximo 2 números. */
export const validateGameName = (texto: string): boolean => {
  return (
    validMinMaxCharacters(texto, 5, 20) &&
    validNoCharactersSpecials(texto) &&
    maxLengtNumbersInCharacters(texto, 2)
  );
};

/** Nombre de usuario (HU2/HU8): 5-20 chars, sin especiales, máximo 3 números, no solo números. */
export const validateUserName = (texto: string): boolean => {
  return (
    validMinMaxCharacters(texto, 5, 20) &&
    validNoCharactersSpecials(texto) &&
    maxLengtNumbersInCharacters(texto, 3) &&
    noOnlyNumbersInCharacters(texto)
  );
};

/** Compatibilidad con el utilitario previo (reglas de usuario). */
export const validInputCreatePartida = (texto: string): boolean =>
  validateUserName(texto);
