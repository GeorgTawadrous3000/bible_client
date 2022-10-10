import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import CircularPercentage from '../ui/CircularPercentage'
import { Consts } from '../../Consts'
import { LangContext, UserContext } from '../../App'
import { Labels } from '../../lang/Labels'

export default function Dashboard(){
    
    const namesArray = require("../../bibleJSON/conventions/arNames.json")
    const conventionsArray = require("../../bibleJSON/conventions/conventions.json")
    const { user } = useContext(UserContext)
    const { lang } = useContext(LangContext)
    const [maxBookNo, setMaxBookNo] = useState(4)
    const changeMaxBookNo = () => {
        setMaxBookNo(maxBookNo === 67 ? 4 : 67)
    } 


    let navigate = useNavigate()
    
    const navigateToTheChapter = (index) => {
        navigate("/viewBible/"+conventionsArray[index]+"/")
    }
    
    var [progresses, setProgresses] = useState([])
    
    const getProgress = () => {
        axios.post(Consts["api_url"]+"bible/getUserProgress", {
            "username": user["username"],
            "email": user["email"]
        }).then(response=>{
            if(response.status === 200){
                setProgresses(response.data)
                console.log(progresses)
            }
        })
    }
    
    useEffect(() => {
        if(user === null){
            navigate("/")
            return
        }
        getProgress()
    }, [user])
    

    if(user === null){
        navigate("/")
        return (<Container/>)
    }

    return (
    <Container>
        <br/>
        <h2>{ Labels.dashboardProgressHeader[lang] }</h2>

        <Row style={{marginTop:15}}>
        {namesArray.map((book, index) => {
            var bookNo = index+1
            var percentage = 0
            var isProgressed = false
            var progressOfBook = {}
            progresses.forEach(progress => {
                if(progress["bookNo"] === bookNo){
                    percentage = progress["percentage"]
                    isProgressed = true
                    progressOfBook = progress
                }
            })
            return isProgressed ? (
                <Col md={3} key={"currentBooks"+bookNo}>
                <div className='bookContainer darkGreen' onClick={()=>{navigateToTheChapter(bookNo)}}>
                    <CircularPercentage percentage={percentage}/>
                    <div className="bookContainerText">
                        {lang === "ar" ? (<>اصحاح {progressOfBook["mostRecentChapter"]} من {progressOfBook["totalNoOfChapters"]}</>) : (<> {progressOfBook["mostRecentChapter"]} out of {progressOfBook["totalNoOfChapters"]}</>)}
                        <br/>
                        {book}
                    </div>
                </div>
                </Col>
            ) : (<></>)
        })}
        </Row>
        
        <br/>

        <div>
            <h2 style={{display: "inline"}}>{ Labels.dashboardAllHeader[lang] }</h2>	&nbsp;
            <a href="#" style={{display: "inline"}} onClick={changeMaxBookNo}>{maxBookNo === 67 ? Labels.minimize[lang] : Labels.maximize[lang]}</a>
        </div>
        
        <Row style={{marginTop:15}}>
            {namesArray.map((book, index) => {
                var bookNo = index+1
                var percentage = 0
                var progressOfBook = (<br/>)
                progresses.forEach(progress => {
                    if(progress["bookNo"] === bookNo){
                        percentage = progress["percentage"]
                        progressOfBook = lang === "ar" ? (<>اصحاح {progress["chapter"]} من {progress["totalNoOfChapters"]}<br/></>) : (<> {progress["chapter"]} out of {progress["totalNoOfChapters"]}<br/></>)
                    }
                })
                return bookNo < maxBookNo ? (
                    <Col md={3} key={"allBooks"+bookNo}>
                    <div className='bookContainer purple' onClick={()=>{navigateToTheChapter(bookNo)}}>
                        <CircularPercentage percentage={percentage}/>
                        <div className="bookContainerText">
                            {progressOfBook}
                            {book}
                        </div>
                    </div>
                    </Col>
                ) : (<></>)
            })}

            <Col md={3}>
                <div className='plusContainer' style={{height: 222}}  onClick={changeMaxBookNo}>
                    <div style={{fontSize: 60}}>
                        {maxBookNo === 67 ? "-" : "+"}
                    </div>
                </div>
            </Col>
        </Row>

        
    </Container>
    )
}