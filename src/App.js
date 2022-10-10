import About from "./components/pages/About";
import Home from "./components/pages/Home";
import 'react-toastify/dist/ReactToastify.css';
import '../src/styles/style.css'
import NavigationBar from "./components/ui/NavigationBar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createContext, useState, useEffect } from "react";
import Register from "./components/pages/Register";
import Login from "./components/pages/Login";
import Footer from "./components/ui/Footer";
import Profile from "./components/pages/Profile";
import ViewBible from "./components/pages/ViewBible";
import Dashboard from "./components/pages/Dashboard";

export const UserContext = createContext(null)
export const ThemeContext = createContext("light")
export const LangContext = createContext("ar")

function App() {

  const [user, setUser] = useState(null)
  const [theme, setTheme] = useState("light")
  const [lang, setLang] = useState("en")
  const style = document.getElementById('style-direction');


  const getUser = () => {
    var user = {}
    try{
      user = JSON.parse(localStorage.getItem("user"))
    }catch(error){
      user = null
    }
    if(!user){
      console.log("no user")
    }else{
      setUser(user)
    }
  }
  
  const getLang = () => {
    var langLocally = localStorage.getItem("lang")
    !langLocally ? localStorage.setItem("lang", "en") : console.log("already there")
    setLang(localStorage.getItem("lang"))
  }

  const getTheme = () => {
    var langLocally = localStorage.getItem("theme")
    !langLocally ? localStorage.setItem("theme", "light") : console.log("already there")
    setTheme(localStorage.getItem("theme"))
  }


  const setUserLocally = (user) => {
    setUser(user)
    localStorage.setItem("user", JSON.stringify(user))
  }

  const removeUserLocally = () => {
    localStorage.setItem("exUser", JSON.stringify(user))
    setUser(null)
    localStorage.removeItem("user")
  }

  const changeLang = (lang) => {
    localStorage.setItem("lang", lang)
    setLang(lang)
  }

  const changeTheme = (theme) => {
    localStorage.setItem("theme", theme)
    setTheme(theme)
  }

  
  useEffect(() => {
    getUser()
    getLang()
    getTheme()
  }, [])

  let darkSheet = document.styleSheets[1]
  let lightSheet = document.styleSheets[0]
  
  useEffect(() => {
    /*if (theme === "dark") {
      style.href = 'https://bible-client.vercel.app/darkbootstrap.min.css';
    } else {
      style.href = 'https://bible-client.vercel.app/bootstrap.min.css';
    }*/
    if(theme == "dark") {
        darkSheet.disabled = false;
        lightSheet.disabled = true;
    } else {
        darkSheet.disabled = true;
        lightSheet.disabled = false;
    }
  }, [theme])
  

  return (
    <div className="App" dir={lang==="en" ? "ltl" : "rtl"}>
      <BrowserRouter>
        <UserContext.Provider value={{user, setUserLocally, removeUserLocally}}>
        <ThemeContext.Provider value={{theme, changeTheme}}>
        <LangContext.Provider value={{lang, changeLang}}>
          
          <NavigationBar/>
          <Routes>
            <Route path="/" element={<Home/>} exact />
            <Route path="/about" element={<About/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/viewbible" element={<ViewBible/>}>
              <Route index element={<ViewBible/>} />
              <Route path=":book" element={<ViewBible/>} />
              <Route path=":book/:chapter" element={<ViewBible/>} />
              <Route path=":book/:chapter/:verse" element={<ViewBible/>} />
            </Route>
            
            
          </Routes>
            <Footer/>
        </LangContext.Provider>
        </ThemeContext.Provider>
        </UserContext.Provider>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
