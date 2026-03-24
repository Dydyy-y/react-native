import type { Theme } from "../types/theme.type";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  theme: Theme;
  toggleTheme: () => void;
}

const Header = ({ theme, toggleTheme }: HeaderProps) => {
  return (
    <header className="bg-stone-200 dark:bg-stone-800 text-gray-600 dark:text-white p-4">
      <nav className="flex space-x-4 items-center justify-between">
        <h1 className="text-lg font-bold">My Dashboard</h1>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </nav>
    </header>
  );
};

export default Header;
