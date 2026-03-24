import type { Theme } from "../types/theme.type";

interface ThemeToggleProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeToggle = ({ theme, toggleTheme }: ThemeToggleProps) => {
  return (
    <button onClick={toggleTheme} className="p-2 flex items-center gap-2">
      ☀️
      <div className="w-12 h-6 bg-gray-400 rounded-full relative transition-colors dark:bg-gray-500">
        <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform dark:translate-x-6" />
      </div>
      🌙
    </button>
  );
};

export default ThemeToggle;
