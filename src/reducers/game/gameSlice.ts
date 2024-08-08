import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Tipos para el estado y las cartas
interface Card {
  id: string;
  str: string;
  value: number;
}

interface CardResult extends Card {
  votes: number;
}

interface Player {
  id: string;
  name: string;
  rol: string[];
  voted: boolean | Card;
}

interface GameState {
  gameName: string | undefined;
  state:
    | "no_started"
    | "started"
    | "ready_to_show_cards"
    | "revealed_cards"
    | "finished";

  players: Player[];
  admins: string[];
  selectedCards: Card[];
  results: { count: CardResult[]; avarage: number };
  poolCards: Card[];
  allPoolCards: Record<string, Card[]>;
}

const initialState: GameState = {
  gameName: "",
  state: "no_started",
  players: [
    { id: "1", name: "Laura", rol: ["viwer"], voted: false },
    {
      id: "3",
      name: "Carlos",
      rol: ["player"],
      voted: { id: "3", str: "5", value: 5 },
    },
    // {
    //   id: "4",
    //   name: "Tomas",
    //   rol: ["player"],
    //   voted: { id: "1", str: "1", value: 1 },
    // },
    // { id: "5", name: "Andrés", rol: ["viwer"], voted: false },
    // {
    //   id: "6",
    //   name: "Camilo",
    //   rol: ["player"],
    //   voted: { id: "4", str: "8", value: 8 },
    // },
  ],
  admins: [],
  selectedCards: [],
  results: { count: [], avarage: 0 },
  poolCards: [
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
  allPoolCards: {
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
  },
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    createGame: (
      state,
      action: PayloadAction<{ gameName: string | undefined; player: Player }>
    ) => {
      state.gameName = action.payload.gameName;
      state.state = "started";
      state.admins = [...state.admins, action.payload.player.id];
      state.players = [...state.players, action.payload.player];
      state.poolCards = state.allPoolCards["fibonacci"];
      state.selectedCards = [
        { id: "3", str: "5", value: 5 },
        // { id: "3", str: "5", value: 5 },
        // { id: "1", str: "1", value: 1 },
        // { id: "4", str: "8", value: 8 },
      ];
    },
    selectCard: (state, action: PayloadAction<{ card: Card; id: string }>) => {
      const { card, id } = action.payload;
      state.players = state.players.map((p) =>
        p.id === id ? { ...p, voted: card } : p
      );
      state.selectedCards = [...state.selectedCards, card];
    },
    userVoted: (state, action: PayloadAction<{ id: string; card: Card }>) => {
      const { id, card } = action.payload;
      state.players = state.players.map((player) =>
        player.id === id ? { ...player, voted: card } : player
      );
    },
    changeStateGame: (
      state,
      action: PayloadAction<
        "no_started" | "started" | "ready_to_show_cards" | "revealed_cards"
      >
    ) => {
      state.state = action.payload;
    },
    everyoneVoted: (state) => {
      const playersInGame = state.players.filter((player) =>
        player.rol.includes("player")
      ).length;
      const cards = state.selectedCards.length;
      if (playersInGame === cards) {
        state.state = "ready_to_show_cards";
      }
    },
    countCardsAndAverage: (state) => {
      let count: Record<string, Card & { votes: number }> = {};
      let sumValues = 0;

      state.selectedCards.forEach((card) => {
        let { id, str, value } = card;

        if (count[id]) {
          count[id].votes++;
        } else {
          count[id] = { id, str, value, votes: 1 };
        }

        sumValues += value;
      });

      const averageValues = sumValues / state.selectedCards.length;
      state.results = { count: Object.values(count), avarage: averageValues };
    },
    restartGame: (state) => {
      state.state = "started";
      state.selectedCards = [];
      state.results = { count: [], avarage: 0 };
      state.players = state.players.map((p) => ({ ...p, voted: false }));
    },
    addPlayer: (state, action: PayloadAction<Player>) => {
      state.players = [...state.players, action.payload];
    },
    toggleViwer: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const user = state.players.find((p) => p.id === id);
      if (!user) return;

      const toggleRole = (role: string) => {
        const index = user.rol.indexOf(role);
        index < 0 ? user.rol.push(role) : user.rol.splice(index, 1);
      };

      toggleRole("viwer");
      toggleRole("player");

      state.players = state.players.map((p) => (p.id === id ? user : p));
      const playersInGame = state.players.filter((player) =>
        player.rol.includes("player")
      ).length;

      if (playersInGame === state.selectedCards.length) {
        state.state = "ready_to_show_cards";
      }
    },

    addRolOwner: (state, action: PayloadAction<string>) => {
      const playerId = action.payload;

      // Colocar todos los players pero con admin en el nuevo usuario
      state.players = state.players.map((p) =>
        p.id === playerId ? { ...p, rol: [...p.rol, "owner"] } : p
      );
    },
    changePoolCards: (state, action: PayloadAction<string>) => {
      console.log(action.payload);
      state.poolCards = state.allPoolCards[action.payload];
    },
  },
});

export const {
  createGame,
  selectCard,
  userVoted,
  changeStateGame,
  everyoneVoted,
  countCardsAndAverage,
  restartGame,
  addPlayer,
  toggleViwer,
  addRolOwner,
  changePoolCards,
} = gameSlice.actions;

export default gameSlice.reducer;
