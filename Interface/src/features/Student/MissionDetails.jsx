import { Button, CircularProgress, Container } from "@mui/material";
import StudentNavigation from "../../components/layout/StudentNavigation"
import { Chip } from "@mui/joy";
import { FaArrowRight, FaCalendar } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa6";
import { IoMdShare } from "react-icons/io";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Connection from "../../services/Connection";
import { requestFailureHandler } from "../../lib/utils";
import { CiCircleCheck } from "react-icons/ci";
import ErrorBox from "../../components/ui/ErrorBox";

const MEDIA_API = import.meta.env.VITE_MEDIA_API;

// const mission = {
//     name: 'Data Science',
//     description: "Seeking a motivated and talented Data scientist to join our dynamic product\
//  development team. This a unique opportunity to work on real-world mission.\n\
// The successful candidate will be responsible for analyzing large datasets of user interactions to extract meaningful\
//  insights.\n\n\
// Responsabilities:\n\
//     - Collect, clean and preprocesses data from various sources.\n\
//     - Develop and implement predictive models and machine learning algorithms.\n\
//     - Create visualizations and dashboards",
//     start_date: '2026-01-02',
//     deadline: '2026-01-20',
//     level: 'Intermediate',
//     skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Data Visualization', 'Tableau'],
//     company: {
//         name: 'Innovate Inc.',
//         description: "Innovate Inc is a leading technology company specializing in creating cutting-edge\
//         solutions for modern businesses. We are passionate about fostering new talent and providing students \
//         with opportunities to grow and learn.",
//         picture: 'https://picsum.photos/seed/blueTech/200/200'
//     }
// }

function Content({mission}) {

    const levelsTheme = {
        Rookie: 'bg-amber-700/30! text-amber-700!',
        Apprentice: 'bg-amber-500/30! text-amber-500!',
        Intermediate: 'bg-blue-700/30! text-blue-700!',
        Challenger: 'bg-blue-500/30! text-blue-500!',
        Expert: 'bg-[#02616b30]! text-[#02616b]!',
        Master: 'bg-[#00aabc30]! text-[#00aabc]!',
        Senior: 'bg-[#03d69330]! text-[#03d693]!'
    }
    const navigate = useNavigate();
    const {id} = useParams();

    // Apply management
    const [applied, setApplied] = useState(!mission.can_apply);
    const [applyLoading, setApplyLoading] = useState(false);
    const [applyError, setApplyError] = useState(null);

    const applyForMission = ()=>{
        if (applyLoading)
            return;
        setApplyError(null)
        Connection.post(`student/missions/${id}/apply/`, {}, (data)=>{
            setApplied(true);
        }, (error)=>{
            console.log(error);
            requestFailureHandler(error, setApplyError, navigate, null, (code, _data)=>{
                if (code === 403 && _data.detail === 'Already applied to this mission') {
                    setApplyError({
                        fr: "Vous avez déjà postulé pour cette mission.",
                        en: "You have already applied for this mission."
                    })
                } else if (code === 403 && _data.detail === 'Only validated student allowed') {
                    setApplyError({
                        fr: "Seuls les étudiants validés sont autorisés au postuler",
                        en: "Only approved students are allowed to apply."
                    })
                }
                else {
                    setApplyError({
                        fr: "Erreur inattendue. Veuillez réessayer",
                        en: "Unexpected error. Try again"
                    })
                }
            })
        }, setApplyLoading, true)
    }

    // Submit management

    return (
        <div className={`grid grid-cols-12 pt-[130px] gap-6`}>
            <div className={`col-span-12 lg:col-span-6 xl:col-span-8`}>
                <div className={`w-full bg-white! border border-gray-200 rounded-2xl shadow-2xs p-5`}>
                    <div className={`flex items-start gap-5 pb-5 border-b border-gray-200`}>
                        <div style={{
                            backgroundImage: `url(${mission.company.picture})`
                        }} className={`w-[90px] h-[90px] rounded-lg bg-center bg-no-repeat bg-cover`}>
                        </div>
                        <div className={``}>
                            <Chip className={`roboto-light text-[12px]! ${levelsTheme[mission.level]}`}>
                                {mission.level}
                            </Chip>
                            <h1 className={`roboto-medium text-[30px]`}>{mission.name}</h1>
                            <h5 className={`text-gray-500 roboto text-[17px]`}>{mission.company.name}</h5>
                        </div>
                    </div>
                    <div className={`flex flex-wrap gap-3 mt-4`}>
                        <div className={`p-3 py-2 w-40 bg-gray-50 rounded-md flex items-center gap-3`}>
                            <FaCalendar className={`text-blue-500 text-[18px]`}/>
                            <div className={``}>
                                <h6 className={`roboto-light text-[12px]`}>Start date</h6>
                                <p className={`roboto-medium text-[13px] mt-1`}>{mission.start_date}</p>
                            </div>
                        </div>
                        <div className={`p-3 py-2 w-40 bg-gray-50 rounded-md flex items-center gap-3`}>
                            <FaCalendar className={`text-blue-500 text-[18px]`}/>
                            <div className={``}>
                                <h6 className={`roboto-light text-[12px]`}>Deadline</h6>
                                <p className={`roboto-medium text-[13px] mt-1`}>{mission.deadline}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`mt-5 w-full bg-white! shadow-2xs border border-gray-200 rounded-2xl p-5 py-7`}>
                    <h4 className={`roboto-medium text-[22px]`}>Mission description</h4>
                    <pre className={`text-gray-500 mt-4 roboto-light wrap-break-word! text-wrap`}>{mission.description}</pre>
                </div>
            </div>
            <div className={`col-span-12 lg:col-span-6 xl:col-span-4`}>
                <div className={`w-full p-5 py-7 bg-white shadow-2xs rounded-2xl border border-gray-200`}>
                    {
                        !applied &&
                        <>
                            <Button onClick={applyForMission} disabled={applyLoading} sx={{
                                textTransform: 'none'
                            }} className={`w-full h-[38px] text-white! bg-blue-500! roboto-medium`}>
                                {
                                    applyLoading ?
                                    <CircularProgress size={17} sx={{
                                        color: 'white'
                                    }} />:
                                    <>
                                        Apply Now
                                    </>
                                }
                            </Button>
                            {
                                applyError && <ErrorBox content={applyError} className="text-[13px]" />
                            }
                        </>
                    }
                    {
                        applied &&
                        <Button sx={{
                            textTransform: 'none'
                        }} variant='outlined' disabled className={`border-green text-green gap-2 roboto h-[38px] w-full`}>
                            <CiCircleCheck className={`text-[22px]`}/>
                            Already applied
                        </Button>
                    }
                    <div className={`mt-3 gap-4 flex justify-around roboto items-center`}>
                        <Button variant='outlined' sx={{
                            textTransform: 'none'
                        }} className={`gap-2 w-[50%] border-gray-200! text-gray-500!`}>
                            <FaBookmark className={``}/>
                            Save Mission
                        </Button>
                        <Button variant='outlined' sx={{
                            textTransform: 'none'
                        }} className={`gap-2 w-[50%] border-gray-200! text-gray-500! roboto`}>
                            <IoMdShare className={``}/>
                            Share
                        </Button>
                    </div>
                </div>
                <div className={`w-full mt-4 p-5 py-7 bg-white shadow-2xs rounded-2xl border border-gray-200`}>
                    <h5 className={`roboto-medium`}>Required Skills</h5>
                    <div className={`mt-4 flex flex-wrap gap-3`}>
                        {
                            mission.skills.map((skill, index)=>(
                                <Chip key={index} className={`roboto-light px-3! text-[15px]`}>
                                    {skill}
                                </Chip>
                            ))
                        }
                    </div>
                </div>
                <div className={`w-full mt-4 p-5 py-7 shadow-2xs bg-white! rounded-2xl border border-gray-200`}>
                    <h5 className={`roboto-medium text-[22px]`}>About {mission.company.name}</h5>
                    <pre className={`text-wrap mt-4 roboto-light text-[14px] text-gray-500 text-justify`}>
                        {mission.company.description}
                    </pre>
                    <Link to={'#'} className={`text-blue-500 group flex items-center gap-1 text-[15px]! mt-3 hover:underline roboto-medium`}>
                        View company profile
                        <FaArrowRight className={`text-blue-500 transition-transform duration-200 ease-in-out group-hover:-rotate-40`}/>
                    </Link>
                </div>
            </div>
        </div>
    )
}

function MissionDetails() {

    const [mission, setMission] = useState({});
    const [loading, setLoading] = useState(true);
    const [requestError, setRequestError] = useState(null);
    const navigate = useNavigate();
    const {id} = useParams();

    const fetchData = ()=>{
        Connection.get(`student/missions/${id}/`, (data)=>{
            setMission(data.mission);
            console.log(`Can apply ${data.mission.company.picture}`)
        }, (error)=>{
            requestFailureHandler(error, setRequestError, navigate, null, (code, data)=>{
                if (code === 404)
                    setRequestError({
                        fr: "Mission introuvable",
                        en: "Mission not found"
                    })
            })
        }, setLoading, true);
    }

    useEffect(()=>{
        fetchData();
    }, [])

    return (
        <div className={`bg-gray-100 min-h-screen`}>
            <StudentNavigation/>
            <Container>
                {
                    loading &&
                    <div className="w-full pt-16 md:pt-20">
                        <div className="w-full h-[200px] flex justify-center items-center">
                            <CircularProgress size={26} sx={{
                                color: '#01406c'
                            }} />
                        </div>
                    </div>
                }
                {
                    !loading && !requestError &&
                    <Content mission={mission} />
                }
                {
                    !loading && requestError &&
                    <div className="w-full pt-16 md:pt-20">
                        <div className="w-full h-[200px] flex justify-center items-center">
                            <strong className="font-normal roboto-medium text-[24px]!">{requestError.fr}</strong>
                        </div>
                    </div>
                }
            </Container>
        </div>
    )
}

export default MissionDetails;
