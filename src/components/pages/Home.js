import React, { useContext, useEffect, useState } from 'react'
import { LangContext, ThemeContext, UserContext } from '../../App'
import { Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import UserHome from '../ui/UserHome'
import GuestHome from '../ui/GuestHome'

export default function Home(){
    
    const { user } = useContext(UserContext)

    return (
        <Container>
            {user != null ? (<UserHome />) : (<GuestHome />)}
            
        </Container>
    )
}