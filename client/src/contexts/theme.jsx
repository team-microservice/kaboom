import { createContext } from "react";
import "../App.css";

const ThemeContext = createContext({
    theme: "dark",
    toggleTheme: () => {}
})

export default ThemeContext;

// export function