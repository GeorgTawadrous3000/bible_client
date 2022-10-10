import React, { useContext } from 'react'
import '../../styles/circle.css'
import { Col, Container, Row } from 'react-bootstrap'
import { ThemeContext } from '../../App'

export default function CircularPercentage(props) {


    const {theme} = useContext(ThemeContext)

    return (
        <div style={{display: "flex",justifyContent: "space-evenly",paddingTop: 15, paddingBottom: 15}}>
            <div className="wrapper">
                <div className={"c100 p"+props.percentage+" "+theme+" orange"}>
                    <span>{props.percentage}%</span>
                    <div className="slice">
                    <div className="bar"></div>
                    <div className="fill"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}