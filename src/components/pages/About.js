import React from 'react'
import { Container } from 'react-bootstrap'
import NavigationBar from '../ui/NavigationBar'
import { LangContext } from '../../App'

export default function About() {

    const { lang } = useContext(LangContext)
    return (
        <>
        <Container>
            <h2>{ Labels.about[lang] }</h2>
        </Container>
        </>
    )
}