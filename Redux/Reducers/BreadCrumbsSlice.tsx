import { createSlice } from "@reduxjs/toolkit";

interface BreadCrumbState {
  parent: string;
  child: string;
}

const initialState: BreadCrumbState = {
  parent: "",
  child: "",
};

const BreadCrumbsSlice = createSlice({
  name: "BreadCrumbSlice",
  initialState,
  reducers: {
    setParent: (state, action) => {
      state.parent = action.payload;
    },
    setChild: (state, action) => {
      state.parent = action.payload;
    },
  },
});

export const { setParent, setChild } = BreadCrumbsSlice.actions;

export default BreadCrumbsSlice.reducer;
