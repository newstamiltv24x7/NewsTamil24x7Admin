import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { setDarkMode } from "@/Redux/Reducers/LayoutSlice";
import { Moon } from "react-feather";

export const DarkMood = () => {
  const { darkMode } = useAppSelector((state) => state.layout);
  const dispatch = useAppDispatch();

  const handleDarkMode = () => {
    dispatch(setDarkMode(!darkMode));
  };

  return (
    <li onClick={handleDarkMode}>
      <div className={`mode ${darkMode ? "active" : ""}`}>
        <Moon className="moon" />
      </div>
    </li>
  );
};
