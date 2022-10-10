import React, { useContext, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { Col, Container, Form, Row, Button } from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import { ThemeContext, UserContext, LangContext } from '../../App'
import { Consts } from '../../Consts'

export default function Register(){
    
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    let navigate = useNavigate()
    
    const { user, setUserLocally } = useContext(UserContext)
    const {lang} = useContext(LangContext)
    const { theme } = useContext(ThemeContext)
    

    if(user != null){
        navigate("/")
        return (<Container/>)
    }

    const register = async (e) => {
        e.preventDefault()
        if(email === "" || password === "" || username === ""){
            toast.error("Fill out all fields", {theme: theme})
            return ""
        }

        axios.post(Consts["api_url"]+"auth/register", {
            username: username,
            email: email,
            password: password,
            userAgent: ["browser", navigator.userAgent, "online"],
            lang: lang
        }).then((response) => {
            if(response.status === 200){
                var user = response.data
                setUserLocally(user)
                navigate("/")
            }else{
                toast.error("Error", {theme: theme})
            }
        }).catch((error) => {
            toast.error(error.response.data, {theme: theme})
        })
    }

    return (
        <>
            <Container>
            <ToastContainer />
            <Row>
                <Col md={4}></Col>
                <Col lg={4} md={12} sm={12} style={{textAlign:"center"}}>
                    <br/>
                    <h2>Register</h2>
                    <br/>
                    <Form onSubmit={register}>
                        <Form.Control required onChange={(e) => {setEmail(e.target.value)}} type="email" placeholder="Email" />
                        <br/>
                        <Form.Control placeholder="Password" onChange={(e) => {setPassword(e.target.value)}} type="password" required />
                        <br/>
                        <Form.Control placeholder="Username" onChange={(e) => {setUsername(e.target.value)}} type="text" required />
                        <br/>
                        <Button type="submit">Register</Button>
                        <br/>
                        <br/>
                        
                    </Form>
                </Col>
            </Row>
        </Container>
        </>
    )
}
