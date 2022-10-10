import React, { useContext } from 'react'
import { LangContext, ThemeContext } from '../../App'
import { Button } from 'react-bootstrap'


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
        const toggle = document.querySelector('dark-mode-toggle');
        changeTheme(toggle.mode)
    }

    return (
        <footer className="text-center text-white" style={{backgroundColor: theme == "dark" ? "rgb(48,48,48)" : "#0a4275"}}>
            <div className="container p-4">

                <section className="mb-6">
                <Button onClick={toggleLang}>{lang == "en" ? "عربي" : "English"}</Button>
                &nbsp;&nbsp;&nbsp;
                <dark-mode-toggle
                      onClick={toggleTheme}
                      id="dark-mode-toggle-1"
                      appearance="switch"
                  ></dark-mode-toggle>
                
                </section>
            </div>

            <div className="text-center p-3" style={{backgroundColor: "rgba(0, 0, 0, 0.2)"}}>
                © 2022 Copyright:
                <a className="text-white" href="http://georgejosephportfolio.rf.gd/main/index.php">georgejosephportfolio.rf.gd</a>
            </div>


            
                    
        </footer>
    )
}
