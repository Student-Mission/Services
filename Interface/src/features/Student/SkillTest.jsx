import { Button, CircularProgress, Container, Radio } from "@mui/material";
import { useEffect, useState } from "react";
import rawMCQ from "../../../test.json";
import dayjs from "dayjs";
import { utc } from "dayjs";
import { Chip, FormControl, FormLabel, Input, LinearProgress } from "@mui/joy";
import { FaClock } from "react-icons/fa6";
dayjs.extend(utc);

const computeTimeData = (datetime='')=>{
    const now = dayjs();
    const target = dayjs.utc(datetime);
    
    let totalSeconds = target.diff(now, 'second');
    if (totalSeconds < 0)
        totalSeconds = 0;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return {
        minutes,
        seconds
    }
}

function SkillTest() {

    
    const currentDatetime = "2025-12-15T18:30:00Z";
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [loading, setLoading] = useState(false);
    const [remainingTime, setRemainingTime] = useState(computeTimeData(currentDatetime));
    
    useEffect(()=>{
        document.title = "Skill test | Student";

        const timer = setInterval(()=>{
            setRemainingTime(computeTimeData(currentDatetime));
        }, 1000)

        return ()=>{
            clearInterval(timer);
        }

    }, [])

    return (
        <div className={`min-h-screen bg-gray-100`}>
            <Container className={`flex justify-center xl:items-center xl:h-screen`}>
                {
                    !loading ?
                    <div className={`w-full shadow-sm rounded-xl bg-white p-4 md:w-[90%] lg:w-[65%] xl:w-[60%] 2xl:w-[60%]`}>
                        <div className={`border-b pb-4 border-gray-300`}>
                            <div className={`flex items-center w-full`}>
                                <Chip sx={{
                                    bgcolor: '#01406c21',
                                    fontFamily: 'Roboto',
                                    color: '#01406c'
                                }}>
                                    Question {currentQuestion} of {questions.length}
                                </Chip>
                                <div className={`flex justify-end items-center flex-1 gap-2 lg:gap-3`}>
                                    <FaClock className={`text-gray-main`}/>
                                    <p className={`roboto text-gray-main`}>{remainingTime.minutes}:{remainingTime.seconds}</p>
                                </div>
                            </div>
                            <LinearProgress sx={{
                                color: '#02616b'
                            }} className={`mt-4 `} determinate value={(currentQuestion/questions.length)*100} />
                        </div>
                        <div className={`mt-5 pb-5 border-b border-gray-300`}>
                            <h2 className={`text-[21px] text-blue-main roboto-medium`}>{questions[currentQuestion - 1].title}</h2>
                            <div className={`mt-4`}>
                                {
                                    questions[currentQuestion - 1].choices.map((choice, index)=>(
                                        <label key={index} htmlFor={`question-${currentQuestion}-${index + 1}`} className={`flex cursor-pointer p-2 mb-3! items-center gap-3 border border-gray-300 rounded-xl`}>
                                            <Radio id={`question-${currentQuestion}-${index + 1}`} value={index} className={``} name={`question-${currentQuestion}`} />
                                            {/* <Input type='radio' className={``} name={currentQuestion} /> */}
                                            <p className={`roboto text-[18px] text-gray-main`}>{choice.text}</p>
                                        </label>
                                    ))
                                }
                            </div>
                        </div>
                        <div className={`flex items-center justify-end w-full`}>
                            <Button sx={{
                                textTransform: 'none'
                            }} className={`roboto h-[38px] bg-blue-main text-white! mt-3!`}>
                                Next Question
                            </Button>
                        </div>
                    </div>:
                    <div className={`flex shadow-sm rounded-xl items-center justify-center h-[200px] bg-white w-full md:w-[90%] lg:w-[65%] xl:w-[60%]`}>
                        <CircularProgress sx={{
                            color: '#01406c'
                        }} />
                    </div>
                }
            </Container>
        </div>
    )
}

const questions = rawMCQ.questions;

export default SkillTest;
