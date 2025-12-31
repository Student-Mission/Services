import { Button, CircularProgress, Container, Radio, RadioGroup, Rating } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import rawMCQ from "../../../test.json";
import dayjs from "dayjs";
import { utc } from "dayjs";
import { Chip, FormControl, FormLabel, Input, LinearProgress } from "@mui/joy";
import { FaClock } from "react-icons/fa6";
import ErrorBox from "../../components/ui/ErrorBox";
import { FaTrophy, FaMedal, FaSadTear, FaArrowLeft } from "react-icons/fa";
import {CgUnavailable} from "react-icons/cg";
import { useNavigate, useParams } from "react-router-dom";
import Connection from "../../services/Connection";
import { requestFailureHandler } from "../../lib/utils";

const MEDIA_API = import.meta.env.VITE_MEDIA_API;
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

const readTestFile = (fileUrl, handler, setLoading, setError, setMode)=>{
    fetch(MEDIA_API + fileUrl) 
      .then((response) => response.json())
      .then((json) => {
        handler(json);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur de lecture:", error)
        setError({
            fr: "Erreur API inattendue",
            en: "Unexpected API error"
        })
        setLoading(false);
        setMode('invalid')
    });
}

function TestSummary({test}) {
    // const test = {
    //     rate: 4.9,
    //     ended: true,
    //     skill: {
    //         name: "Javascript",
    //         mission_rate: 6.7,
    //     },
    //     extras: {
    //         total_responses: 10,
    //         level: 'Apprentice',
    //         based_missions: 3,
    //         success_percent: 20,
    //         success_responses: 2,
    //     }
    // }

    const getExpression = (_successPercent=0.0)=>{
        let expression = 'low';

        if (_successPercent > 50) {
            expression = 'good';
        }
        if (_successPercent > 80)
            expression = 'great';
        return expression;
    }

    const levelsTheme = {
        Rookie: 'bg-amber-700/30! text-amber-700!',
        Apprentice: 'bg-amber-500/30! text-amber-500!',
        Intermediate: 'bg-blue-700/30! text-blue-700!',
        Challenger: 'bg-blue-500/30! text-blue-500!',
        Expert: 'bg-[#02616b30]! text-[#02616b]!',
        Master: 'bg-[#00aabc30]! text-[#00aabc]!',
        Senior: 'bg-[#03d69330]! text-[#03d693]!'
    }

    const currentExpression = getExpression(test.extras.success_percent);

    const expressionDetails = {
        great: { // 81-100
            icon: FaTrophy,
            title: {
                en: "Excellent Job!",
                fr: "Excellent travail!"
            },
            brief: {
                en: `You have successfully completed the ${test.skill.name} skill assessment. Your performance has been analyzed and your profile rating updated`,
                fr: `Vous avez réussi l'évaluation de compétences ${test.skill.name}. Vos performances ont été analysées et votre profil a été mis à jour.`
            },
            class: 'bg-green-300/20 text-green-500'
        },
        good: { // 51 - 80
            icon: FaMedal,
            title: {
                en: "Good work!",
                fr: "Bon travail !"
            },
            brief: {
                en: `Nice job — you passed the ${test.skill.name} assessment with a solid score. Review the weaker topics to push your skills further.`,
                fr: `Bon travail — vous avez réussi l'évaluation de ${test.skill.name} avec un bon score. Revoyez les points faibles pour progresser davantage.`
            },
            class: 'bg-amber-300/20 text-amber-500'
        },

        low: { // 0 - 50
            icon: FaSadTear,
            title: {
                en: "Needs improvement",
                fr: "À améliorer"
            },
            brief: {
                en: `Your ${test.skill.name} assessment shows there are gaps to address. Take the recommended resources and try again to improve your mastery.`,
                fr: `L'évaluation de ${test.skill.name} montre des lacunes à combler. Consultez les ressources recommandées et réessayez pour améliorer votre maîtrise.`
            },
            class: 'bg-orange-700/10 text-orange-800'
        },
    }

    const CurrentIcon = expressionDetails[currentExpression].icon;

    return (
        <div className={`bg-white px-12 py-10 shadow-sm rounded-xl border border-gray-200 w-full md:w-[70%] lg:w-[65%] xl:w-[50%] 2xl:w-[65%]`}>
            <div className={`flex justify-center`}>
                <div className={`w-[90px] h-[90px] flex items-center justify-center rounded-full ${expressionDetails[currentExpression].class}`}>
                    <CurrentIcon className="text-[31px] "/>
                </div>
            </div>
            <h2 className={`roboto-medium text-[33px] text-center my-3`}>
                {
                    expressionDetails[currentExpression].title.en
                }
            </h2>
            <div className={`flex items-center mb-5 justify-center`}>
                <p className={`w-full text-center roboto-light text-gray-500 md:w-[86%] lg:w-[67%] xl:w-[55%] 2xl:w-[60%] text-wrap`}>
                    {
                        expressionDetails[currentExpression].brief.en
                    }
                </p>
            </div>
            <div className={`grid grid-cols-12 pb-5 border-b border-gray-300 gap-4 justify-center`}>
                <div className={`col-span-12 bg-[#00aabc10] min-h-[100px] border border-[#00aabc19] md:col-span-6 lg:col-span-4 py-6 rounded-xl`}>
                    <h5 className={`roboto text-[15px] text-center text-sky`}>TEST SCORE</h5>
                    <h6 className={`roboto-semibold text-[38px] text-center text-sky`}>{test.extras.success_percent}%</h6>
                    <p className={`roboto text-center text-[16px]`}>{test.extras.success_responses}/{test.extras.total_responses} Correct</p>
                </div>
                <div className={`col-span-12 bg-white min-h-[100px] border border-gray-200 md:col-span-6 lg:col-span-4 py-6 rounded-xl`}>
                    <h5 className={`roboto text-[12px] text-center text-gray-600`}>MISSION RATE</h5>
                    <h6 className={`roboto-semibold text-[38px] text-center text-black`}>{test.skill.mission_rate} <span className={`text-gray-500 text-[21px]`}>/10</span></h6>
                    <div className={`flex items-center justify-center`}>
                        <Rating max={10}  value={test.skill.mission_rate} readOnly className={`text-[15px]!`} />
                    </div>
                    <p className={`text-[12px] text-gray-400 roboto text-center mt-2`}>Based on {test.extras.based_missions} missions</p>
                </div>
                <div className={`col-span-12 bg-white min-h-[100px] border border-gray-200 md:col-span-6 lg:col-span-4 py-6 rounded-xl`}>
                    <h5 className={`roboto text-[12px] text-center text-gray-600`}>OVERALL RATE</h5>
                    <h6 className={`roboto-semibold text-[38px] text-center text-black`}>{test.rate} <span className={`text-gray-500 text-[21px]`}>/10</span></h6>
                    <div className={`flex items-center justify-center`}>
                        {/* <Rating max={10}  value={test.mission_rate} readOnly className={`text-[15px]!`} /> */}
                        <Chip className={`roboto ${levelsTheme[test.extras.level]}`}>
                            {test.extras.level}
                        </Chip>
                    </div>
                    <p className={`text-[12px] text-gray-400 roboto text-center mt-2`}>Global Skill Rating</p>
                </div>
            </div>
            <div className="flex items-center justify-center mt-4">
                <Button sx={{
                    textTransform: 'none'
                }} className="bg-blue-main roboto-medium px-7! h-[38px] text-white!">
                    View Profile
                </Button>
            </div>
        </div>
    )
}

function InvalidTest({}) {

    const title = "Skill Test Currently Unavailable";
    const brief = "The skill test is currently unavailable because the link is invalid or expired. Check the link, contact support, or explore other available assessments."
    return (
        <div className={`bg-white px-12 py-10 shadow-sm rounded-xl border border-gray-200 w-full md:w-[70%] lg:w-[65%] xl:w-[50%] 2xl:w-[65%]`}>
            <div className={`flex items-center justify-center`}>
                <div className={`flex items-center rounded-full justify-center h-[90px] w-[90px] text-sky-dark bg-[#02616b21]`}>
                    <CgUnavailable className={`text-[31px]`}/>
                </div>
            </div>
            <h2 className={`roboto-medium text-[33px] text-center my-3`}>
                {
                    title
                }
            </h2>
            <div className={`flex items-center mb-5 justify-center`}>
                <p className={`w-full text-center text-[19px] roboto-light text-gray-500 md:w-[86%] lg:w-[67%] xl:w-[55%] 2xl:w-[60%] text-wrap`}>
                    {
                        brief
                    }
                </p>
            </div>
            <div className={`flex items-center justify-center w-full gap-4`}>
                <Button variant='outlined' sx={{
                    textTransform: 'none'
                }} className={`gap-3 roboto-medium border-sky text-sky`}>
                    <FaArrowLeft className={``} />
                    Back to Skills
                </Button>
                <Button sx={{
                    textTransform: 'none'
                }} className={`bg-blue-main text-white! roboto-medium px-4!`}>
                    Go to Dashboard
                </Button>
            </div>
        </div>
    )
}

function SkillTest() {
    
    // const [currentDatetime, setCurrentDatetime] = useState("");
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [responses, setResponses] = useState({});
    const [currentResponse, setCurrentResponse] = useState(-1);
    const [loading, setLoading] = useState(true);
    const [requestLoading, setRequestLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fetchError, setFetchError] = useState(null);
    const [test, setTest] = useState(null);
    const {name, id} = useParams();
    const [questions, setQuestions] = useState([]);
    const navigate = useNavigate();
    const [testData, setTestData] = useState({
        expires_at: ""
    })
    const [remainingTime, setRemainingTime] = useState("");
    const timeShift = useRef(null);
    
    useEffect(()=>{
        document.title = "Skill test | Student";
        fetchData();
        // setRemainingTime(computeTimeData(testData.expires_at));
        const timer = setInterval(()=>{
            if (!timeShift.current)
                return;
            setRemainingTime(computeTimeData(timeShift.current));
        }, 1000)

        return ()=>{
            clearInterval(timer);
        }

    }, [])

    const fetchData = ()=>{
        Connection.get(`student/profile/skills/tests/${id}/`, (data)=>{
            if (data.test) {
                setTest(data.test);
                setLoading(false);
                setMode('result');
                return;
            }

            setTestData(data);
            timeShift.current = data.expires_at;
            readTestFile(data.test_file, (content)=>{
                setQuestions(content.questions);
                setRemainingTime(computeTimeData(data.expires_at));
                setMode('test');
            }, setLoading, setFetchError, setMode);
        }, (_error)=>{
            setLoading(false);
            requestFailureHandler(_error, setFetchError, navigate, null, (code, data)=>{
                setMode('invalid');
            })
        }, null, true);
    }

    const handleNext = ()=>{
        if (currentQuestion === 10)
            return;
        setError(null);
        if (currentResponse === -1) {
            setError({
                fr: "La réponse est requise",
                en: "Response is required"
            })
            return;
        }
        setResponses({
            ...responses,
            [`${currentQuestion-1}`]: currentResponse
        })
        setCurrentResponse(-1);
        setCurrentQuestion(currentQuestion + 1);
    }

    const handleSubmit = ()=>{
        if (requestLoading) return;
        if (currentQuestion !== 10)
            return;
        setError(null);
        if (currentResponse === -1) {
            setError({
                fr: "La réponse est requise",
                en: "Response is required"
            })
            return;
        }
        setResponses({
            ...responses,
            [`${currentQuestion-1}`]: currentResponse
        })
        submit();
    }
    
    const submit = ()=>{
        // setRequestLoading(true);
        if (requestLoading) return;
        Connection.put(`student/profile/skills/tests/${id}/`, {responses}, (data)=>{
            navigate('/student/profile');
        }, (_error)=>{
            requestFailureHandler(_error, setError, navigate, (data)=>{
                setError({
                    fr: "Format de réponses invalide",
                    en: "Invalid responses format"
                })
            })
        }, setRequestLoading, true);
    }

    const handleChange = (event)=>{
        setCurrentResponse(event.target.value)
    }

    const [mode, setMode] = useState('result'); // test invalid result

    return (
        <div className={`min-h-screen bg-gray-100`}>
            <Container className={`flex justify-center xl:items-center xl:h-screen`}>
                {
                    !loading && mode === 'test' &&
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
                            <RadioGroup onChange={handleChange} value={currentResponse} className={`mt-4`}>
                                {
                                    questions[currentQuestion - 1].choices.map((choice, index)=>(
                                        <label key={index} htmlFor={`question-${currentQuestion}-${index + 1}`} className={`flex cursor-pointer p-2 mb-3! items-center gap-3 border border-gray-300 rounded-xl`}>
                                            <Radio id={`question-${currentQuestion}-${index + 1}`} value={index} className={``} name={`question-${currentQuestion}`} />
                                            {/* <Input type='radio' className={``} name={currentQuestion} /> */}
                                            <p className={`roboto text-[18px] text-gray-main`}>{choice.text}</p>
                                        </label>
                                    ))
                                }
                            </RadioGroup>
                        </div>
                        {
                            error && <ErrorBox content={error} />
                        }
                        
                        <div className={`flex items-center justify-end w-full`}>
                            {
                                currentQuestion < 10 &&
                                <Button onClick={handleNext} sx={{
                                    textTransform: 'none'
                                }} className={`roboto h-[38px] bg-blue-main text-white! mt-3!`}>
                                    Next Question
                                </Button>
                            }
                            {
                                currentQuestion === 10 &&
                                <Button onClick={handleSubmit} disabled={requestLoading} sx={{
                                    textTransform: 'none'
                                }} className={`roboto w-[120px] h-[38px] bg-blue-main text-white! mt-3!`}>
                                    {
                                        requestLoading ?
                                        <CircularProgress size={19} sx={{
                                            color: 'white'
                                        }} />:
                                        <>Submit</>
                                    }
                                </Button>
                            }
                        </div>
                    </div>
                }
                {
                    loading &&
                    <div className={`flex shadow-sm rounded-xl items-center justify-center h-[200px] bg-white w-full md:w-[90%] lg:w-[65%] xl:w-[60%]`}>
                        <CircularProgress sx={{
                            color: '#01406c'
                        }} />
                    </div>
                }
                {
                    !loading && mode === 'result' &&
                    <TestSummary test={test} />
                }
                {
                    !loading && mode === 'invalid' && 
                    <InvalidTest/>
                }
            </Container>
        </div>
    )
}

// const questions = rawMCQ.questions;

export default SkillTest;
