import React, { useContext, useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import NavigationBar from '../ui/NavigationBar'
import { LangContext } from '../../App'
import { Labels } from '../../lang/Labels'

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