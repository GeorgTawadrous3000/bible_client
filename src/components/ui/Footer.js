import React, { useContext } from 'react'
import { LangContext, ThemeContext } from '../../App'
import { Button } from 'react-bootstrap'
import DarkModeToggle from "react-dark-mode-toggle"


export default function Footer() {

    const { lang, changeLang } = useContext(LangContext)
    const { theme, changeTheme } = useContext(ThemeContext)

    const toggleLang = () => {
        if(lang == "en"){
            changeLang("ar")
        }else{
            changeLang("en")  
        }
    }

    const toggleTheme = () => {
        if(theme == "dark"){
            changeTheme("light")
        }else{
            changeTheme("dark")  
        }
    }

    return (
        <footer className="bg-dark text-center text-white">
            <div className="container p-4">

                <section className="mb-6">
                <Button onClick={toggleLang}>{lang == "en" ? "عربي" : "English"}</Button>
                &nbsp;
                <DarkModeToggle
                    onChange={toggleTheme}
                    checked={theme == "dark"}
                    speed={2}
                    />
                
                </section>
            </div>

            <div className="text-center p-3" style={{backgroundColor: "rgba(0, 0, 0, 0.2)"}}>
                © 2022 Copyright:
                <a className="text-white" href="http://georgejosephportfolio.rf.gd/main/index.php">georgejosephportfolio.rf.gd</a>
            </div>


            
                    
        </footer>
    )
}
