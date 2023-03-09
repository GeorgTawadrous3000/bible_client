import React, { useContext, useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { LangContext, ThemeContext, UserContext } from '../../App'
import { Labels } from '../../lang/Labels'
import { useNavigate } from 'react-router'
import { Consts } from '../../Consts'
import ProgressBar from 'react-bootstrap/ProgressBar'
import axios from 'axios'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import { ToastContainer, toast } from 'react-toastify'
import Box from '@mui/material/Box'
import Popper from '@mui/material/Popper'
import SaveIcon from '@mui/icons-material/Save'
import NoteIcon from '@mui/icons-material/Note'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'

export default function ViewBible(){
    
    const reverseConventions = require(`../../bibleJSON/conventions/reverseConventions.json`)

    // Popper Controls
    const [anchorEl, setAnchorEl] = useState(null);
    const [disablePopper, setDisablePopper] = useState(false)

    // STYLE MODIFIERS
    var [marginModifier, setMarginModifier] = useState(0)
    var [fontSize, setFontSize] = useState(20)
    var [blockOrInlineModifier, setBlockOrInlineModifier] = useState("inline")
    var [selectingMode, setSelectingMode] = useState(true)
    var [refreshVar, setRefreshVar] = useState("")

    // Chapter View Modifiers
    var [saveProgress, setSaveProgress] = useState(true)
    var [progressInterval, setProgressInterval] = useState(0)
    var [done, setDone] = useState(false)

    const { lang } = useContext(LangContext)
    const { user } = useContext(UserContext)
    const { theme } = useContext(ThemeContext)

    // Get Params
    var { book, chapter, verse } = useParams()
    var bookNo = reverseConventions[book]
    var chapterNoForArrays = Number(chapter)-1
    var verseNoForArrays = Number(verse)-1
    let navigate = useNavigate()
    
    // Progresses and highlights
    var [progresses, setProgresses] = useState([])
    var [highlightedVerses, setHighlightedVerses] = useState([])
    var [highlightedVersesData, setHighlightedVersesData] = useState([])
    

    const getProgress = () => {
        axios.post(Consts["api_url"]+"bible/getUserProgress", {
            "username": user["username"],
            "email": user["email"],
            "book": book
        }).then(response=>{
            if(response.status === 200){
                setProgresses(response.data)
    		    console.log(response.data[0]["doneChapters"])
                const bookData = require(`../../bibleJSON/${book}.json`)
                var doneVerse = response.data[0]["doneChapters"][chapter]
                if(book && chapter){
                    console.log(bookData.chapters[chapter-1].noOfVerses)
                    console.log(doneVerse)

                    if(doneVerse != bookData.chapters[chapter-1].noOfVerses){
                        document.querySelector(`[verseNumber="${doneVerse-2}"]`).scrollIntoView()
                        document.querySelector(`[verseNumber="${doneVerse}"]`).className = "styledVerse clickedStyledVerse"
                        console.log(`[verseNumber="${doneVerse}"]`);
                        console.log(document.querySelector(`[verseNumber="${doneVerse}"]`))
                    }
                }
            }
        })
    }
    
    const getHighlightedVerses = () => {
        axios.post(Consts["api_url"]+"bible/getHighlightedVerses", {
            username: user["username"],
            email: user["email"],
            book: book,
            chapter: chapter
        }).then(response=>{
            if(response.status === 200){
                setHighlightedVersesData(response.data)
                var verses = []
                response.data.forEach(verse => {
                    verses.push(verse.verse)
                })
                setHighlightedVerses(verses)
            }
        })
    }
    
    useEffect(() => {
        // Check if the get params are avaliable
        if(!book && !chapter && !verse){
            navigate("/dashboard")
        }

        // Get from local storage all modifiers
        setMarginModifier(!localStorage.getItem("marginModifier") ? 0 : Number(localStorage.getItem("marginModifier")))
        setFontSize(!localStorage.getItem("fontSize") ? 20 : Number(localStorage.getItem("fontSize")))
        setBlockOrInlineModifier(!localStorage.getItem("blockOrInline") ? "inline" : localStorage.getItem("blockOrInline"))
        setDisablePopper(localStorage.getItem("disablePopper") === "true" ? true : false)
        setSelectingMode(localStorage.getItem("selectingMode") === "true" ? true : false)

        // scroll listener for the current verse 
        var elements = document.querySelectorAll('.styledVerse')
        var targettedBottomElement = elements[0]
 
        // set progress timeout 
        const setProgressOnTheServer = async () => {
            /*const bookData = require(`../../bibleJSON/${book}.json`)
            var totalNoOfVerses = bookData.chapters[chapterNoForArrays].noOfVerses
            var expectedTakenTime = totalNoOfVerses * 20000*/

            var previousVerseNo = 0

            axios.post(Consts["api_url"]+"bible/getUserProgress", {
                "username": user["username"],
                "email": user["email"],
                "book": book
            }).then(response=>{
                if(response.status === 200){
                    previousVerseNo = (response.data[0]["doneChapters"][chapter])
                }
            })
            const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            await delay(180000);
            const interval = setInterval(() => {
                if(window.location.href.includes("viewBible")){
                    if(saveProgress){
                        try {
                            var verseNumber = Number(targettedBottomElement.getAttribute("verseNumber"))
                            console.log(verseNumber)
                            console.log(previousVerseNo)
                            
                            if(verseNumber > previousVerseNo){
                                console.log(verseNumber)
                                previousVerseNo = (verseNumber)
                                axios.post(Consts["api_url"]+"bible/setUserProgress", {
                                    email: user.email, 
                                    username: user.username,
                                    book: book,
                                    chapter: Number(chapter),
                                    verse: verseNumber
                                }).then((response) => {
                                    console.log(response.data)
                                    toast.success(Labels["progressSaved"][lang], {theme: theme})
                                })
                            }
                        } catch (error) {
                            if(!window.location.href.includes("viewBible")){
                                clearInterval(interval)  
                            }
                        }
                    }else{
                        if(window.location.href.includes("viewBible")){
                            clearInterval(interval)  
                        }
                    }
                }
            }, 120000)
            setProgressInterval(interval)
        }

        // user check
        if(user === null){
            console.log("no current user")
        }else{
            if(!verse){
                getProgress()
            }
            if(saveProgress && !verse){
                setProgressOnTheServer()
            }else{
                clearInterval(progressInterval)
            }
	    if(book && chapter){    
            	getHighlightedVerses()
	    }
	}
        
        // scroll listener to set progress
        window.addEventListener('scroll', function() {
            if(this.window.location.href.includes("viewBible")){
                try{
                    var bottomElement = elements[0]
                    var previousPosition = elements[0].getBoundingClientRect()
                    elements.forEach((element) => {
                        try {
                            var position = element.getBoundingClientRect()
                        
                            if(position.bottom >= previousPosition.bottom && position.bottom <= window.innerHeight && position.top >= 0){
                                bottomElement = element
                                return
                            }
                            previousPosition = element.getBoundingClientRect()    
                        } catch (error) {}
                    })
                    targettedBottomElement = bottomElement
                }catch(e){}
            }
        })
        return () => {
            clearInterval(progressInterval)
        }

    }, [user, chapter, saveProgress, refreshVar])  
    
    
    
    if(!book && !chapter && !verse){
        navigate("/dashboard")
        return (<Container></Container>)
    }

    
    const bookData = require(`../../bibleJSON/${book}.json`)

    const toggleSelectingMode = () => {
        setSelectingMode(selectingMode ? false : true)
        setRefreshVar(Math.random().toString())
        document.querySelectorAll(".styledVerse").forEach((styledVerse) => {
            if(!styledVerse.className.includes("highlightedStyledVerse")){
                if(selectingMode){
                    styledVerse.className = "styledVerse normalStyledVerse"
                }else{
                    styledVerse.className = "styledVerse"
                }
            }
        })
        localStorage.setItem("selectingMode", selectingMode ? false : true)
    }

    const toggleDisablePopper = () => {
        setDisablePopper(disablePopper ? false : true)
        setAnchorEl(false)
        localStorage.setItem("disablePopper", disablePopper ? false : true)
    }

    const toggleBlockOrInline = () => {
        setBlockOrInlineModifier(blockOrInlineModifier === "inline" ? "block" : "inline")
        localStorage.setItem("blockOrInline", blockOrInlineModifier === "inline" ? "block" : "inline")
    }
    
    const toggleSaveProgress = () => {
        setSaveProgress(saveProgress ? false : true)
    }
    

    const changeFont = (moreOrLess) => {
        if(moreOrLess === "more"){
            setFontSize(fontSize+3)
        }else{
            fontSize > 20 ? setFontSize(fontSize-3) : console.log()
        }
        localStorage.setItem("fontSize", fontSize)
    }

    const changeMarginModifier = (moreOrLess) => {
        if(moreOrLess === "more"){
            setMarginModifier(marginModifier+3)
        }else{
            marginModifier == 0 ? console.log() : setMarginModifier(marginModifier-3)
        }
        localStorage.setItem("marginModifier", marginModifier)
    }

    const formatControls = (isChapter) => (
        <Row style={{marginBottom: 15}}>
            <Col md='5'>
                {isChapter ? (<>

                <FormControlLabel
                    label={<b>{Labels.inlineReadingMode[lang]}</b>}
                    control={<Checkbox checked={blockOrInlineModifier === "block" ? true : false} onChange={() => toggleBlockOrInline()} />}
                />
                

                <FormControlLabel
                label={<b>{Labels.saveProgressCheckbox[lang]}</b>}
                control={<Checkbox checked={saveProgress ? true : false} onChange={() => toggleSaveProgress()} />}
                />
                    
                <FormControlLabel
                    label={<b>{Labels.showControlsCheckBox[lang]}</b>}
                    control={<Checkbox checked={disablePopper ? false : true} onChange={() => toggleDisablePopper()} />}
                    />

                <FormControlLabel
                    label={<b>{Labels.selectingModeCheckBox[lang]}</b>}
                    control={<Checkbox checked={selectingMode ? true : false} onChange={() => toggleSelectingMode()} />}
                    />

                    </>) : ""}

            </Col>
            <Col md="5" style={{marginBottom: 5}}>
                <button className="btn btn-outline-primary" onClick={()=>{changeFont("more")}}>+</button>&nbsp;&nbsp;
                <button className="btn btn-outline-primary" onClick={()=>{changeFont("less")}}>-</button>
            </Col>
            {isChapter ? (<Col md="2">
                {blockOrInlineModifier === "block" ? (<button className="btn btn-outline-primary" onClick={()=>{changeMarginModifier("more")}}>+</button>) : ""}&nbsp;&nbsp;
                {blockOrInlineModifier === "block" ? (<button className="btn btn-outline-primary" onClick={()=>{changeMarginModifier("less")}}>-</button>) : ""}
            </Col>) : ""}
        </Row>
    )

    
    const handleClicking = (event) => {
        if(event.currentTarget.className.includes("highlightedStyledVerse")){
            return
        }
        if(event.currentTarget.className.includes("clickedStyledVerse")){
            event.currentTarget.className = "styledVerse "
            event.currentTarget.className += selectingMode ? "normalStyledVerse" : ""
            
        }else{
            event.currentTarget.className = "styledVerse clickedStyledVerse"
        }
    }

    const handlePointerEntering = (event) => {
        disablePopper ? console.log("") : setAnchorEl(event.currentTarget)
        try{
        document.getElementById("textArea").children[1].value = ""
        document.getElementById("textArea").style.display = "none"
        }catch(e){}
    }

    const open = Boolean(anchorEl)
    const id = open ? 'simple-popper' : undefined

    const saveHighlightedVerse = (event) => {
        
        axios.post(Consts.api_url+"bible/highlightVerse", {
            username: user.username,
            email: user.email,
            book: book,
            chapter: chapter,
            verse: Number(anchorEl.getAttribute("verseNumber")),
            note: document.getElementById("textArea").children[1].value,
            verseData: bookData["chapters"][chapterNoForArrays]["verses"][Number(anchorEl.getAttribute("verseNumber")-1)].replace('"', ''),
            verseTitle: `${bookData.name} (${chapter} : `+ Number(anchorEl.getAttribute("verseNumber")) + ")"
        }).then((response) => {
            console.log(response.data)
            anchorEl.className = "styledVerse highlightedStyledVerse"
            try{
                document.getElementById("textArea").children[1].value = ""
                document.getElementById("textArea").style.display = "none"
            }catch(e){}
            setAnchorEl(false)
        })
    }

    const deleteHighlightedVerse = () => {
        axios.post(Consts.api_url+"bible/removehighlightVerse", {
            username: user.username,
            email: user.email,
            book: book,
            chapter: chapter,
            verse: Number(anchorEl.getAttribute("verseNumber"))
        }).then((response) => {
            console.log(response.data)
            anchorEl.className = "styledVerse "
            anchorEl.className += selectingMode ? "normalStyledVerse" : ""
            try{
                document.getElementById("textArea").children[1].value = ""
                document.getElementById("textArea").style.display = "none"
            }catch(e){}
            setAnchorEl(false)
        })
    }

    const styledVerse = (verse, number) => {     
        var highlighted = highlightedVerses.includes(number)
        
        var backgroundStyledVerse = "styledVerse "
        backgroundStyledVerse += highlighted ? "highlightedStyledVerse" : selectingMode ? "normalStyledVerse" : ""
        return ( 
            <>
                <div style={{display: blockOrInlineModifier,marginBottom: marginModifier}} className={backgroundStyledVerse} verseNumber={number} id={"verse"+number} onClick={handleClicking} onPointerEnter={handlePointerEntering}  key={number}>
                    <Link to={`${book}/${chapter}/${number}`} className="verseNumber" onClick={()=>{setRefreshVar(Math.random().toString())}}>{number}</Link>
                    <p className="verse">{verse}</p>
                </div>
            </>
        )
    }
    
    const versePage = () => {
        var highlightData = {}
        highlightedVersesData.forEach(highverse => {
            if(highverse.verse === Number(verse)){
                highlightData = highverse
            }
        })
        return (<>
            <div className="row justify-content-between">
                <div className='col-4'>
                    <h2>{`${bookData.name} (${chapter} : ${verse})`}</h2>
                </div>
                <div className='col-2'>
                    <Link className='btn btn-primary' to={`${book}/${chapter}`}>{Labels["back"][lang]}</Link>
                </div>
            </div>
            {formatControls(false)}
            <div style={{fontSize: fontSize}}>
                {styledVerse(bookData.chapters[chapterNoForArrays].verses[verseNoForArrays].replace('"',''), Number(verse))}
            </div>
            <div>
                {highlightData.note ? (
                <>
                    <br/>
                    <h2>{Labels["noteH2"][lang]}:</h2>
                    <h4>{highlightData.note}</h4>
                </>
                ) : (<></>)}
            </div>
            
        </>)
    }

    const chapterPage = () => (
        <>
            <Row className="justify-content-between">
                <Col md='4'>
                    <h2>{`${bookData.name} ${chapter}`}</h2>
                </Col>
                <Col md='2'>
                    <Link className='btn btn-primary' to={`${book}`}>{Labels["back"][lang]}</Link>
                </Col>
            </Row>
            <br/>
            <Row className="justify-content-md-center">
                <audio controls autoplay>
                    <source src={`https://st-takla.org/Multimedia/audio-bible/www.St-Takla.org--${bookNo}_${chapter}.mp3`} type="audio/mpeg"/>
                </audio>
            </Row>
            <br/>
            {formatControls(true)}
            <div style={{fontSize: fontSize}}>
                {
                bookData.chapters[chapterNoForArrays].verses.map((verse,index) => {
                    return styledVerse(verse.replace('"', ""), index+1)
                }) 
                }
            </div>
            <br/>

            {
                chapter == bookData.noOfChapters ? (<></>) :(<>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <FormControlLabel
                            label={<b>{Labels["done"][lang]}</b>}
                            checked={done}
                            control={<Checkbox onChange={() => {setDone(done ? false : true)}} />}
                        />
                    </div>
                    </>)
            }
            <div style={{display: "flex", justifyContent: "center"}}>
                { chapter == 1 ? (<></>) : 
                (<><button className='btn btn-primary' onClick={() => previousChapter()}>{Labels['previous'][lang]}</button>&nbsp;</>)
                }
                {
                    chapter == bookData.noOfChapters ? (<></>) :
                    (<><button className='btn btn-primary' onClick={() => nextChapter(bookData.chapters[chapterNoForArrays].verses.length)}>{Labels['next'][lang]}</button></>)

                }
            </div>
            <Popper id={id} open={open} anchorEl={anchorEl}>
                <Box sx={{ border: 1, p: 1, bgcolor: theme === "dark" ? "black" : "white"}}>
                    <div style={{display: "inline-block"}}>
                        <button className="btn btn-outline-primary" onClick={()=>{setAnchorEl(null)}}><CloseIcon /></button>&nbsp;&nbsp;&nbsp;
                        <button className="btn btn-outline-primary"  onClick={saveHighlightedVerse}><SaveIcon /></button>&nbsp;&nbsp;&nbsp;
                        <button className="btn btn-outline-primary" onClick={()=>{
                    
                            axios.post(Consts["api_url"]+"bible/getHighlightedVerses", {
                                username: user["username"],
                                email: user["email"],
                                book: book,
                                chapter: chapter,
                                verse: Number(anchorEl.getAttribute("verseNumber"))
                            }).then(response=>{
                                if(!response.data.note){
                                    document.getElementById("textArea").children[1].value = ""
                                }else{
                                    document.getElementById("textArea").children[1].value = (response.data.note)
                                }
                                document.getElementById("textArea").style.display = document.getElementById("textArea").style.display === "none" ? "block" : "none"
                            }).catch((e) => {
                                document.getElementById("textArea").children[1].value = ""
                                document.getElementById("textArea").style.display = document.getElementById("textArea").style.display === "none" ? "block" : "none"
                            })

                        }}><NoteIcon /></button>&nbsp;&nbsp;&nbsp;
                        <button className="btn btn-outline-primary" onClick={deleteHighlightedVerse}><DeleteIcon /></button>
                        <div id="textArea" style={{display:"none"}}>
                            <br/>
                            <textarea dir={lang==="en" ? "ltl" : "rtl"} className='form-control' dire placeholder={Labels["noteTextAreaPlaceholder"][lang]}></textarea>
                        </div>
                    </div>
                </Box>
            </Popper>
        </>
    )
    
    const bookPage = () => (
        <>
        <div className="row justify-content-between">
            <div className='col-4'>
                <h2>{`${bookData.name}`}</h2>
            </div>
            <div className='col-2'>
                <Link className='btn btn-primary' to={``}>{Labels["back"][lang]}</Link>
            </div>
        </div>
        <br/>
        <div className="row">
        {bookData.chapters.map((chapter, index) => {
            try{
                var chapterIndex = index+1
                var percentage = (progresses[0]["doneChapters"][chapterIndex.toString()] / chapter.noOfVerses) * 100
                return (
                <div className='col-2'>
                    <Link style={{marginBottom: 0, borderRadius: 0}} className="btn btn-outline-primary buttonChapter" to={`${book}/${chapter.noOfChapter}`}>{chapter.noOfChapter}</Link>
                    <ProgressBar style={{borderRadius: 0}} animated now={percentage} />
                    <br/>
                </div>
                )
            }catch(e){
                return (
                    <div className='col-2'>
                        <Link style={{marginBottom: 15}} className="btn btn-outline-primary buttonChapter" to={`${book}/${chapter.noOfChapter}`}>{chapter.noOfChapter}</Link>
                        <br/>
                    </div>
                    )
            }
            
        })}
        </div>
    </>
    )

    const nextChapter = (noOfVerses) => {
        if(done){
            axios.post(Consts["api_url"]+"bible/setUserProgress", {
                email: user.email, 
                username: user.username,
                book: book,
                chapter: Number(chapter),
                verse: noOfVerses
            }).then((response) => {
                console.log(response.data)
                toast.success(Labels["progressSaved"][lang], {theme: theme})
				//navigate(`/viewBible/${book}/${Number(chapter)+1}`)
                window.location.href = (`/viewBible/${book}/${Number(chapter)+1}`)
                setDone(false)
            })
        }else{
			//navigate(`/viewBible/${book}/${Number(chapter)+1}`)
            window.location.href = (`/viewBible/${book}/${Number(chapter)+1}`)
        }
    }

    const previousChapter = () => {
		//navigate(`/viewBible/${book}/${Number(chapter)-1}`)
        window.location.href = (`/viewBible/${book}/${Number(chapter)-1}`)
    }
    
    
    var page = !chapter ? bookPage() : !verse ? chapterPage() : versePage()
    return (<Container><ToastContainer/><br/>{page}<br/><br/></Container>)
}
