import { createSlice } from "@reduxjs/toolkit";

interface BreadCrumbState {
  croppedImageSource: any;
}

const initialState: BreadCrumbState = {
  croppedImageSource: null,
};

const CroppedImageSlice = createSlice({
  name: "LanguageSlice",
  initialState,
  reducers: {
    setCroppedImageSource: (state, action) => {
      state.croppedImageSource = action.payload;
    },
  },
});

export const { setCroppedImageSource } = CroppedImageSlice.actions;

export default CroppedImageSlice.reducer;
