import React, {useContext} from 'react'
import { Container } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import { UserContext } from '../../App'

export default function Profile() {

    const { user } = useContext(UserContext)
    let navigate = useNavigate()

    if(user === null){
        navigate("/")
        return (<Container/>)
    }

    return (
        <Container>
            <h2>Profile</h2>
        </Container>
    )
}