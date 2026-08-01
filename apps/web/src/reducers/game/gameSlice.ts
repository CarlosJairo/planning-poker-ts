import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ALL_POOLS } from "@planning-poker/shared";
import type {
  Card,
  CardResult,
  GameState,
  Player,
  Room,
} from "@planning-poker/shared";

export interface GameStateType {
  roomId: string;
  gameName: string;
  state: GameState;
  players: Player[];
  ownerIds: string[];
  selectedCards: Card[];
  results: { count: CardResult[]; avarage: number };
  poolKey: string;
  poolCards: Card[];
  allPoolCards: Record<string, Card[]>;
}

const initialState: GameStateType = {
  roomId: "",
  gameName: "",
  state: "no_started",
  players: [],
  ownerIds: [],
  selectedCards: [],
  results: { count: [], avarage: 0 },
  poolKey: "fibonacci",
  poolCards: ALL_POOLS.fibonacci,
  allPoolCards: ALL_POOLS,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setRoomState: (state, action: PayloadAction<Room>) => {
      state.roomId = action.payload.id;
      state.gameName = action.payload.name;
      state.state = action.payload.state;
      state.players = action.payload.players;
      state.ownerIds = action.payload.ownerIds;
      state.selectedCards = action.payload.selectedCards;
      state.results = action.payload.results;
      state.poolKey = action.payload.poolKey;
      state.poolCards = action.payload.poolCards;
    },
    resetGameState: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { setRoomState, resetGameState } = gameSlice.actions;

export default gameSlice.reducer;
