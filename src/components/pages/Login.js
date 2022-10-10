import React, { useContext, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { Col, Container, Form, Row, Button } from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import { LangContext, ThemeContext, UserContext } from '../../App';
import {Consts} from '../../Consts'

export default function Login(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    let navigate = useNavigate()
    
    const { user, setUserLocally } = useContext(UserContext)
    const {lang} = useContext(LangContext)
    const {theme} = useContext(ThemeContext)

    if(user != null){
        navigate("/")
        return (<Container/>)
    }

    const login = (e) => {
        e.preventDefault()
        if(email === "" || password === ""){
            toast.error("Fill out all fields", {theme: theme})
            return ""
        }

        console.log("1")
        axios.post(Consts['api_url']+"auth/login", {
            email: email,
            password: password,
            userAgent: ["browser", navigator.userAgent],
            lang: lang
        }).then((response) => {
            if(response.status === 200){
                var user = response.data
                setUserLocally(user)
                navigate("/")
            }else{
                console.log(response)
                toast.error("Error", {theme: theme})
            }
        }).catch((error) => {
            toast.error(error.response.data, {theme: theme})
        })

        
    }

    return (
    <Container>
        <ToastContainer />
        <Row>
            <Col md={4}></Col>
            <Col lg={4} md={12} sm={12} style={{textAlign:"center"}}>
                <br/>
                <h2>Login</h2>
                <br/>
                <Form onSubmit={login}>
                    <Form.Control required onChange={(e) => {setEmail(e.target.value)}} type="email" placeholder="Email" />
                    <br/>
                    <Form.Control placeholder="Password" onChange={(e) => {setPassword(e.target.value)}} type="password" required />
                    <br/>
                    <Button type="submit">Login</Button>  
                </Form>
                <br/>
            </Col>
        </Row>
    </Container>
    )
}