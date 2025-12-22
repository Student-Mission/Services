import { useEffect, useState } from "react";
import StudentNavigation from "../../components/layout/StudentNavigation";
import { Avatar, Container, Button, CircularProgress, Skeleton } from "@mui/material";
import { FaStar, FaFilter } from "react-icons/fa";
import { Chip } from "@mui/joy";
import Connection from "../../services/Connection";
import { requestFailureHandler } from "../../lib/utils";
import { useNavigate } from "react-router-dom";

const MEDIA_API = import.meta.env.VITE_MEDIA_API;

const makeMain = (name='')=>{
    const elements = name.split(' ');
    return elements[0]
}

// Components

const RecommendedMissionCard = ({mission, last=false})=>{

    const levelsTheme = {
        Rookie: 'bg-amber-700/30! text-amber-700!',
        Apprentice: 'bg-amber-500/30! text-amber-500!',
        Intermediate: 'bg-blue-700/30! text-blue-700!',
        Challenger: 'bg-blue-500/30! text-blue-500!',
        Expert: 'bg-[#02616b30]! text-[#02616b]!',
        Master: 'bg-[#00aabc30]! text-[#00aabc]!',
        Senior: 'bg-[#03d69330]! text-[#03d693]!'
    }

    return (
        <div className={`h-[100px] px-4 flex items-start gap-5 ${!last && 'border-b mb-4 border-gray-100'}`}>
            <div style={{
                backgroundImage: `url(${MEDIA_API + mission.company.picture})`
            }} className={`bg-center mt-1 h-14 w-14 rounded-xl border border-gray-200`}>
            </div>
            <div className={`mt-1`}>
                <h6 className={`text-[18px] roboto`}>{mission.name}</h6>
                <p className={`text-gray-main roboto-light text-[15px]`}>{mission.company.name}.</p>
                <Chip className={`roboto-light text-[12px]! ${levelsTheme[mission.level]}`}>
                    {mission.level}
                </Chip>
            </div>
            <div className={`mt-1 flex-1 flex justify-end`}>
                <Button sx={{
                    textTransform: 'none'
                }} className={`bg-blue-main text-white! roboto h-10 w-[100px]`}>
                    Apply
                </Button>
            </div>
        </div>
    )
}

// Main

function Content({data, loading}) {

    const brief = "Here's an overview of your progress and recommended missions.";
    const filters = [
        {label: 'All', value: 'all'},
        {label: 'Apprentice', value: 'apprentice'},
        {label: 'Rookie', value: 'rookie'}
    ]
    const [activeFilter, setActiveFilter] = useState('all');
    const statusStyles = {
        completed: {
            text: 'Completed',
            sx: 'bg-green-600/30! text-green-600!'
        },
        in_progress: {
            text: 'In progress',
            sx: 'bg-amber-600/30! text-amber-600!'
        }
    }

    return (
        <div className={`pt-[130px]`}>
            {
                !loading &&
                <div className={``}>
                    <h2 className={`roboto-medium text-[35px]`}>Welcome back, {makeMain(data.profile.username)}</h2>
                    <p className={`roboto-light text-gray-main`}>{brief}</p>
                </div>
            }
            <div className={`mt-14 pb-5 grid grid-cols-12 gap-6`}>
                <div className={`col-span-12 lg:col-span-4`}>
                    <div className={`shadow-2xs bg-white p-3 py-5 ${loading && 'h-[200px] flex items-center justify-center'}`}>
                        {
                            !loading ?
                            <>
                            <div className={`flex items-center justify-center`}>
                                <Avatar alt={data.profile.username} src={MEDIA_API + data.profile.picture} className={`w-[100px]! h-[100px]! bg-blue-main text-3xl! roboto`} />
                            </div>
                            <h4 className={`roboto text-center mt-5 text-[21px]`}>{data.profile.username}</h4>
                            <p className={`roboto-light text-gray-main text-[19px] text-center`}>{data.profile.level}</p>
                            <p className={`flex items-center gap-2 justify-center roboto-light text-gray-main mt-0 text-[19px]`}>
                                <FaStar className={`text-yellow-500`}/> 
                                Global rate: {data.profile.global_rate}/10
                            </p>
                            </>:
                            <CircularProgress size={25} />
                        }
                    </div>
                </div>
                <div className={`col-span-12 lg:col-span-8`}>
                    <div className={`bg-white rounded-2xl p-4 py-5`}>
                        <div className={`pb-4 border-b border-gray-200`}>
                            <h4 className={`roboto-medium text-[20px]`}>Recommended Missions</h4>
                            <div className={`flex items-center mt-3`}>
                                <div className={`flex items-center gap-2 text-gray-main`}>
                                    <FaFilter className={`text-[13px]`} />
                                    <span className={`roboto-light`}>Filter by: </span>
                                </div>
                                <div className={`ms-5 flex flex-wrap gap-3`}>
                                    {
                                        loading && [1, 2].map((i)=>(
                                            <Skeleton width={80} height={38} />
                                        ))
                                    }
                                    {
                                        !loading && filters.map((filter, index)=>(
                                            <Chip key={index} className={`px-5! py-1 text-[13px]! roboto ${activeFilter === filter.value && 'text-[#00aabc]! bg-[#00aabc21]!'}`}>
                                                {filter.label}
                                            </Chip>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                        {
                            !loading && data.missions.length === 0 &&
                            <div className={`h-[200px] flex items-center justify-center`}>
                                <strong className={`font-normal roboto text-gray-main`}>No available missions.</strong>
                            </div>
                        }
                        <div className={`mt-5`}>
                            {
                                !loading && data.missions.map((mission, index)=>(
                                    <RecommendedMissionCard mission={mission} key={index} last={index === 2} />
                                ))
                            }
                        </div>
                        {
                            loading &&
                            <div className={`h-[300px] flex items-center justify-center`}>
                                <CircularProgress size={29} />
                            </div>
                        }
                    </div>
                    {
                        !loading &&
                        <div className={`mt-4 rounded-2xl bg-white p-4 py-5`}>
                            <h4 className={`roboto-medium`}>My Missions</h4>
                            <div className={`w-full overflow-x-scroll mt-4`}>
                                <div className={`min-w-[390px]`}>
                                    <div className={`bg-gray-100 h-[45px] px-4`}>
                                        <div className={`h-full grid grid-cols-12`}>
                                            <div className={`col-span-4 text-[13px] text-gray-main roboto-medium flex items-center`}>
                                                MISSION TITLE
                                            </div>
                                            <div className={`col-span-3 text-[13px] text-gray-main roboto-medium flex items-center`}>
                                                COMPANY
                                            </div>
                                            <div className={`col-span-3 text-[13px] text-gray-main roboto-medium flex items-center`}>
                                                SUBMISSION DATE
                                            </div>
                                            <div className={`col-span-2 text-[13px] text-gray-main roboto-medium flex items-center`}>
                                                STATUS
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        data.current_missions.map((mission, index)=>(
                                            <div key={index} className={`h-[55px] px-4 grid grid-cols-12 border-b border-gray-200`}>
                                                <div className={`h-full text-[15px] col-span-4 flex items-center roboto`}>
                                                    {mission.mission.name}
                                                </div>
                                                <div className={`h-full col-span-3 flex items-center roboto-light text-[15px] text-gray-main`}>
                                                    {mission.company.name}
                                                </div>
                                                <div className={`h-full col-span-3 flex items-center roboto text-[15px] text-gray-main`}>
                                                    {mission.mission.deadline}
                                                </div>
                                                <div className={`h-full col-span-2 flex items-center roboto`}>
                                                    <Chip className={`roboto-light text-[12px]! ${statusStyles[mission.mission.status].sx}`}>
                                                        {statusStyles[mission.mission.status].text}
                                                    </Chip>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

function Dashboard() {

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [requestError, setRequestError] = useState(null);
    const navigate = useNavigate();

    // const [data, setData] = useState({
    //     profile: {
    //         username: 'Abiola Shadow',
    //         picture: 'none',
    //         level: 'Rookie',
    //         global_rate: 8.3
    //     },
    //     missions: [
    //         {
    //             uuid: 'm-1a2b3c4d',
    //             name: 'Landing Page Redesign',
    //             level: 'Apprentice', // Rookie, Apprentice, Intermediate, Challenger, Expert, Master, Senior
    //             company: {
    //                 picture: 'https://via.placeholder.com/80x80.png?text=BlueTech',
    //                 name: 'BlueTech'
    //             }
    //         },
    //         {
    //             uuid: 'm-5e6f7g8h',
    //             name: 'Payments API Integration',
    //             level: 'Intermediate',
    //             company: {
    //                 picture: 'https://via.placeholder.com/80x80.png?text=PayFlux',
    //                 name: 'PayFlux'
    //             }
    //         },
    //         {
    //             uuid: 'm-9i0j1k2l',
    //             name: 'Mobile Prototype (React Native)',
    //             level: 'Challenger',
    //             company: {
    //                 picture: 'https://via.placeholder.com/80x80.png?text=Novala',
    //                 name: 'Novala'
    //             }
    //         }
    //     ],
    //     current_missions: [
    //         {
    //             name: 'Frontend UI Kit',
    //             company: 'WebFlow',
    //             deadline: '2025-12-17',
    //             status: 'completed'
    //         },
    //         {
    //             name: 'API Integration',
    //             company: 'Stripe',
    //             deadline: '2026-01-09',
    //             status: 'in_progress'
    //         },
    //         {
    //             name: 'Database migration',
    //             company: 'DataStream LLC',
    //             deadline: '2025-12-29',
    //             status: 'completed'
    //         }
    //     ]
    // })

    const fetchData = ()=>{
        Connection.get('student/dashboard/', (_data)=>{
            setData(_data);
        }, (error)=>{
            requestFailureHandler(error, setRequestError, navigate);
        }, setLoading, true)
    }

    useEffect(()=>{
        document.title = "Student Dashboard | STM";
        fetchData();
    }, [])

    return (
        <div className={`min-h-screen bg-gray-50`}>
            <StudentNavigation/>
            <Container>
                {
                    !requestError ?
                    <Content data={data} loading={loading} />:
                    <div className={`pt-16 md:pt-20 h-[400px] flex items-center justify-center`}>
                        <strong className={`text-[19px] font-normal roboto-medium`}>{requestError.en}</strong>
                    </div>
                }
                
            </Container>
        </div>
    )
}

export default Dashboard;
