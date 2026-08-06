import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../reducers/user/userSlice";
import gameSlice from "../reducers/game/gameSlice";
import toastSlice from "../reducers/toast/toastSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    game: gameSlice,
    toast: toastSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
