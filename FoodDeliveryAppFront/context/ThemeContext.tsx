import { Colors } from "@/constants/Colors";
import { createContext, ReactNode, useState } from "react";
import { Appearance, ColorSchemeName } from "react-native";

type ThemeContextType = {
  colorScheme: ColorSchemeName;
  setColorScheme: (scheme: ColorSchemeName) => void;
  theme: typeof Colors.dark | typeof Colors.light;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ colorScheme, setColorScheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
