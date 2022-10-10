import React, { useContext } from 'react'
import { LangContext, ThemeContext } from '../../App'
import { Button } from 'react-bootstrap'
import ToggleButton from "react-theme-toggle-button";
import "react-theme-toggle-button/dist/index.css";


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
        <footer className="bg-light text-center text-white">
            <div className="container p-4">

                <section className="mb-6">
                <Button onClick={toggleLang}>{lang == "en" ? "عربي" : "English"}</Button>
                &nbsp;&nbsp;&nbsp;
                <ToggleButton isDark={theme == "dark"}
                    onChange={toggleTheme}
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
