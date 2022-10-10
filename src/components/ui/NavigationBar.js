import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { UserContext } from '../../App'
import { useContext } from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import { Labels } from '../../lang/Labels'
import { LangContext } from '../../App'
import { Consts } from '../../Consts'

export default function NavigationBar() {

    const {user, removeUserLocally} = useContext(UserContext)
    let navigate = useNavigate()

    const logout = () => {
        axios.post(Consts["api_url"]+"auth/logout", {
            email: user.email, 
            username: user.username,
            userID: user.userID,
            userAgent: ["browser", navigator.userAgent]
        }).then((response) => {
            if(response.status === 200){
                console.log(response.data)
                removeUserLocally()
                navigate("/")
            }else{
                toast.error("Error")
            }
        })
    }

    const {lang, setLang} = useContext(LangContext)
    
    return (
        <>
        <ToastContainer/>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Container>
                    <Link className="navbar-brand" to="/">{Labels["title"][lang]}</Link>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Link to="/about" className="nav-link">{Labels["about"][lang]}</Link>
                            
                        </Nav>
                        <Nav>

                        {user != null ? (
                                <>
                                    <Link to="/profile" className="nav-link">{user.username}</Link>
                                    <a href="#" onClick={()=>{logout()}} className="nav-link">{Labels["logout"][lang]}</a>
                                </>
                            ) : (
                                <>
                                    <Link to="/register" className="nav-link">{Labels["register"][lang]}</Link>
                                    <Link to="/login" className="nav-link">{Labels["login"][lang]}</Link>
                                </>
                            )}
                    

                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

        </>
    )
}