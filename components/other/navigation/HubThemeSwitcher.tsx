"use client";
import { useTheme } from "next-themes";

export default function HubThemeSwitcher() {
  const { setTheme, theme } = useTheme();

  // Function to toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  // Determining if the current theme is dark
  const isDarkMode = theme === "dark";

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        className="sr-only peer"
        type="checkbox"
        checked={isDarkMode}
        onChange={toggleTheme}
        aria-label="Toggle Dark Mode"
      />
      <div className="w-8 h-8 rounded-full justify-center  ring-0 peer duration-1000 outline-none bg-gray-200 overflow-hidden before:flex before:items-center before:justify-center after:flex after:items-center after:justify-center before:content-['☀️'] before:absolute before:h-8 before:w-8 before:top-1/2 before:bg-white before:rounded-full before:left-1 before:-translate-y-1/2 before:transition-all before:duration-1000 peer-checked:before:opacity-0 peer-checked:before:rotate-90 peer-checked:before:-translate-y-full shadow-lg shadow-gray-400 peer-checked:shadow-lg peer-checked:shadow-gray-700 peer-checked:bg-[#383838] after:content-['🌑'] after:absolute after:bg-[#1d1d1d] after:rounded-full after:top-[4px] after:right-1 after:translate-y-full after:w-8 after:h-8 after:opacity-0 after:transition-all after:duration-1000 peer-checked:after:opacity-100 peer-checked:after:rotate-180 peer-checked:after:translate-y-0 items-center"></div>
    </label>
  );
}
