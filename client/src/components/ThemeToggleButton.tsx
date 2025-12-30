import { useTheme } from "../hooks/useTheme";
import { Moon, Sun } from "lucide-react";

const ThemeToggleButton = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="p-2 mx-2 rounded-full bg-gray-200 hover:bg-gray-400 text-gray-950 transition-all duration-300 hover:bg-red-hover cursor-pointer"
    >
      {isDark ? <Sun size={16}/> : <Moon size={16}/>}
    </button>
  );
};

export default ThemeToggleButton;
