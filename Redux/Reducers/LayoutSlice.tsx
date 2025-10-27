import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  toggleSidebar: false,
  pinedMenu: [""],
  responsiveSearch: false,
  darkMode: false,
  flip: false,
  margin: 0,
};

const LayoutSlice = createSlice({
  name: "LayoutSlice",
  initialState,
  reducers: {
    setToggleSidebar: (state, action) => {
      state.toggleSidebar = action.payload;
    },
    setPinedMenu: (state, action) => {
      state.pinedMenu = action.payload;
    },
    handlePined: (state, action) => {
      if (action.payload) {
        if (state.pinedMenu.includes(action.payload)) {
          let filterMenu = state.pinedMenu.filter((item) => item !== action.payload);
          state.pinedMenu = filterMenu;
        } else {
          state.pinedMenu = [...state.pinedMenu, action.payload];
        }
      }
    },
    handleResponsiveToggle: () => {
      const sidebarClass = document.getElementById("sidebar-wrappers");
      const headerClass = document.getElementById("page-headers");
      const sidebar = sidebarClass?.classList.contains("close_icon");
      const header = headerClass?.classList.contains("close_icon");
      if (sidebar && header) {
        sidebarClass?.classList.remove("close_icon");
        headerClass?.classList.remove("close_icon");
      } else {
        sidebarClass?.classList.add("close_icon");
        headerClass?.classList.add("close_icon");
      }
    },
    setResponsiveSearch: (state) => {
      state.responsiveSearch = !state.responsiveSearch;
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      if (state.darkMode) {
        document.body.classList.remove("light-only");
        document.body.classList.add("dark-only");
      } else {
        document.body.classList.remove("dark-only");
        document.body.classList.add("light-only");
      }
    },
    setFlip: (state) => {
      state.flip = !state.flip;
    },
    scrollToLeft: (state) => {
      state.margin += 500;
    },
    scrollToRight: (state) => {
      state.margin -= 500;
    },
  },
});

export const { setToggleSidebar, setPinedMenu, handlePined, handleResponsiveToggle, setResponsiveSearch, setDarkMode, setFlip, scrollToLeft, scrollToRight } = LayoutSlice.actions;

export default LayoutSlice.reducer;
