import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Card } from "@planning-poker/shared";

export interface UserState {
  id: string;
  name: string;
  rolCurrentUser: string[];
  voted: boolean | Card;
}

const initialState: UserState = {
  id: "",
  name: "",
  rolCurrentUser: [],
  voted: false,
};

const userSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    setCurrentUserFromRoom: (
      state,
      action: PayloadAction<{
        id: string;
        name: string;
        roles: string[];
        voted: boolean | Card;
      }>
    ) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.rolCurrentUser = action.payload.roles;
      state.voted = action.payload.voted;
    },
    clearCurrentUser: (state) => {
      state.id = "";
      state.name = "";
      state.rolCurrentUser = [];
      state.voted = false;
    },
  },
});

export const { setCurrentUserFromRoom, clearCurrentUser } = userSlice.actions;

export default userSlice.reducer;
