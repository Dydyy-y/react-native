import { useEffect, useState } from "react";
import Header from "./components/Header";
import type { Theme } from "./types/theme.type";
import ToDoSection from "./components/ToDo/ToDoSection";

const App = () => {
  const [theme, setTheme] = useState<Theme>("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <ToDoSection />
    </div>
  );
};

export default App;
