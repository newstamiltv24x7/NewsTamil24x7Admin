import { configureStore } from "@reduxjs/toolkit";
import HeaderBookmarkSlice from "./Reducers/HeaderBookmarkSlice";
import LanguageSlice from "./Reducers/LanguageSlice";
import LayoutSlice from "./Reducers/LayoutSlice";

import ThemeCustomizerSlice from "./Reducers/ThemeCustomizerSlice";
import CroppedImageSlice from "./Reducers/CroppedImageSlice";
import BreadCrumbsSlice from "./Reducers/BreadCrumbsSlice";

const Store = configureStore({
  reducer: {
    layout: LayoutSlice,
    headerBookMark: HeaderBookmarkSlice,
    themeCustomizer: ThemeCustomizerSlice,
    langSlice: LanguageSlice,
    croppedImageSlice: CroppedImageSlice,
    breadCrumbsSlice: BreadCrumbsSlice,
  },
});

export default Store;

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
