"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Switch } from "@nextui-org/switch";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  return (
    <div className="flex items-center">
      <Switch
        checked={isDarkMode}
        onChange={toggleTheme}
        size="lg"
        color="primary"
        startContent={<SunIcon />}
        endContent={<MoonIcon />}
      />
    </div>
  );
}
