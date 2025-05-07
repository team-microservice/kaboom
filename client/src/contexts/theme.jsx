import { createContext, useState } from "react";
import "../App.css";

const ThemeContext = createContext({
    theme: "dark",
    toggleTheme: () => {}
})
export default ThemeContext
export function ThemeProvider(props) {
    const [theme, setTheme] = useState("dark")
    const toggleTheme = () => {
        setTheme(theme === "light" ? "light" : "dark")
    }

    return (
        <ThemeContext.Provider
        value={({
            theme: theme,
            toggleTheme: toggleTheme
        })}
        >
            {props.children}
        </ThemeContext.Provider>
    )
}




// export function