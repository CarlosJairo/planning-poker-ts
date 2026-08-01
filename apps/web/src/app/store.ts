import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../reducers/user/userSlice";
import gameSlice from "../reducers/game/gameSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    game: gameSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
