import { createContext, useState, useEffect } from "react";
export const ThemeContext = createContext();

export const ThemeProvider = ({children})=> {

    const persistantTheme = localStorage.getItem("theme");
    const themeOptions = ['dark', 'light'];
    const [theme, setTheme] = useState(persistantTheme ? persistantTheme: 'light');
    const toggleTheme = ()=> {
        localStorage.setItem("theme", theme === 'light' ? 'dark': 'light');
        setTheme(theme === 'light' ? 'dark': 'light');
    }
    useEffect(()=>{
        if (theme == 'light') {
            document.body.style.backgroundColor = 'white'
        } else {
            // document.body.style.backgroundColor = "#171920ff";
            document.body.style.backgroundColor = "#080c15";
        }
    }, [theme])
    return (
        <ThemeContext.Provider value={{theme, toggleTheme}} >
            {children}
        </ThemeContext.Provider>
    )
}
