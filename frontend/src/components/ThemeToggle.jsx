import React, { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { LanguageContext } from "../context/LanguageContext";
import { FaSun, FaMoon, FaGlobe } from "react-icons/fa";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { language, changeLanguage } = useContext(LanguageContext);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  return (
    <div className="flex items-center gap-2">
      {/* Language Selector */}
      <div className="relative">
        <button
          onClick={() => setShowLanguageMenu(!showLanguageMenu)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-1"
          aria-label="Select language"
        >
          <FaGlobe className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300 hidden md:inline">
            {currentLanguage.code.toUpperCase()}
          </span>
        </button>
        
        {showLanguageMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  changeLanguage(lang.code);
                  setShowLanguageMenu(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm ${
                  language === lang.code
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? (
          <FaSun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        ) : (
          <FaMoon className="w-5 h-5 text-yellow-500" />
        )}
      </button>
    </div>
  );
}