import { useEffect, useState } from "react";
import { Sun, Moon, Trees, Check } from "lucide-react";

const THEMES = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "forest", label: "Forest", icon: Trees },
];

const ThemeSelector = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("thinkpad_theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("thinkpad_theme", theme);
  }, [theme]);

  const currentTheme = THEMES.find((t) => t.id === theme) || THEMES[0];
  const CurrentIcon = currentTheme.icon;

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle btn-sm md:btn-md"
        aria-label="테마 선택"
        title={`현재 테마: ${currentTheme.label}`}
      >
        <CurrentIcon className="w-5 h-5 text-base-content/80" />
      </div>
      <ul
        tabIndex={0}
        className="z-50 p-2 mt-2 space-y-1 border shadow-lg dropdown-content menu bg-base-200 rounded-box w-44 border-base-300"
      >
        <li className="px-2 py-1 text-xs font-bold tracking-wider uppercase menu-title text-base-content/60">
          Theme
        </li>
        {THEMES.map((t) => {
          const Icon = t.icon;
          const isSelected = theme === t.id;
          return (
            <li key={t.id}>
              <button
                type="button"
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-content font-semibold"
                    : "hover:bg-base-300 text-base-content"
                }`}
                onClick={() => {
                  setTheme(t.id);
                  if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                  }
                }}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{t.label}</span>
                </div>
                {isSelected && <Check className="w-4 h-4" />}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ThemeSelector;
