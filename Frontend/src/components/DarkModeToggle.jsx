import { useEffect, useState } from "react";
import { FaSun, FaMoon } from 'react-icons/fa';

export default function FunDarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first, then fall back to system preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Updates document class and saves preference
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(prev => !prev)}
      className={`fixed z-50 top-4 right-4 p-1 rounded-full border-2 border-[#444444] dark:border-[#E0E0E0] bg-white dark:bg-[#121212] text-[#444444] dark:text-[#E0E0E0] hover:bg-[#E0E0E0] dark:hover:bg-[#444444] transition-colors duration-300 shadow-lg`}
      aria-label="Toggle dark mode"
    >
      {isDark ? <FaMoon size={16} /> : <FaSun size={16} />}
    </button>
  );
}