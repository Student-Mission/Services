import { useContext, useEffect, useState } from "react";
import CompanyNavigation from "../../components/layout/CompanyNavigation";
import Container from "../../components/layout/Container";
import { Avatar, Button, Card, CircularProgress, IconButton } from "@mui/material";
import cover from "../../assets/images/cover.png";
import { FaCalendar, FaExternalLinkAlt, FaStar } from "react-icons/fa";
import dayjs from "dayjs";
import 'dayjs/locale/fr';
import utc from "dayjs/plugin/utc";
import { Autocomplete, Breadcrumbs, FormControl, FormLabel, Input, Link, Option, Select, Textarea, Typography, Chip as JChip, Chip, LinearProgress } from "@mui/joy";
import Connection from "../../services/Connection";
import { useNavigate, useParams } from "react-router-dom";
import { GlobalContext } from "../../contexts/Global";
import { missionRules } from "./rules/new_mission";
import Validator from "../../lib/validations/validator";
import ErrorBox from "../../components/ui/ErrorBox";
import { MdContentCopy, MdLink } from "react-icons/md";
import ApplicantProfile from "../../components/layout/ApplicantProfile";
import { GoDotFill } from "react-icons/go";

dayjs.locale('fr');
dayjs.extend(utc);
const MEDIA_API = import.meta.env.VITE_MEDIA_API;

const formatDate = (d) => {
    if (!d) return '';
    const s = dayjs(d).format('DD MMMM YYYY'); // "01 décembre 2025"
    const parts = s.split(' ');
    // capitalise le premier caractère du mois -> "Décembre"
    if (parts.length >= 3) parts[1] = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
    return parts.join(' ');
};

const toInputDate = (d)=>{
    if (!d)
        return '';
    return dayjs(d).utc().format('YYYY-MM-DD');
}

const rawSkillsToLabels = (_skills=[])=> {
    
    return _skills.map((skill)=>(
        {label: skill}
    ))
}

const labelSkillsToRaw = (_skills=[])=>{

    return _skills.map((skill)=>(
        skill.label
    ))
}

function Header({loading, mission, activeTab, setActiveTab, editMode, setEditMode}) {

    const tabs = [
        {
            value: 'overview',
            displayed: 'Overview'
        },
        {
            value: 'applications',
            displayed: 'Applications'
        }
    ]

    const statusDisplayable = {
        'in-progress': 'In progress',
        'not-started': 'Not started',
        'ended': 'Completed'
    }

    const statusThemes = {
        'in-progress': {
            text: 'text-orange-500!',
            bg: 'bg-orange-500/30!',
            border: 'border-orange-500!'
        },
        'not-started': {
            text: 'text-amber-500!',
            bg: 'bg-amber-500/10!',
            border: 'border-amber-500!'
        },
        'ended': {
            text: 'text-green-500!',
            bg: 'bg-green-500/30!',
            border: 'border-green-500!'
        }
    }

    return (
        <div className={`p-4 ps-0 pe-0`}>
            {
                loading ?
                <></>:
                <>
                    <div className={``}>
                        <Breadcrumbs className={`ps-0!`}>
                        {
                            ['Home', 'Missions'].map((path)=>(
                                <Link key={path} color='neutral' href={'#'}>
                                    {path}
                                </Link>
                            ))

                        }
                            <Typography>
                                {
                                    mission.name
                                }
                            </Typography>
                        </Breadcrumbs>
                        <div className={`mt-4 flex items-center`}>
                            <div className={`w-[65%] text-wrap!`}>
                                <h1 className={`roboto-semibold text-[35px] wrap-break-word`}>{mission.name}</h1>
                                <p className={`text-gray-500 roboto`}>ID: #{mission.uuid}</p>
                            </div>
                            {
                                mission.status === 'not_started' &&
                                <div className={``}>
                                    {
                                        !editMode && activeTab === 'overview' &&
                                        <Button onClick={()=>setEditMode(true)} sx={{
                                            textTransform: 'none'
                                        }} className={`bg-blue-main text-white! h-[38px]`}>
                                            Edit
                                        </Button>
                                    }
                                </div>
                            }
                        </div>
                        {
                            mission.status === 'not_started' &&
                            <div className={`mt-5 border-b border-gray-100 flex items-center gap-2`}>
                                {
                                    tabs.map((tab)=>(
                                        <div onClick={()=>setActiveTab(tab.value)} key={tab.value} className={`px-3 py-3 roboto border-b-2 cursor-pointer border-transparent ${activeTab === tab.value ? 'border-[#01406c]! bg-[#01406c07] text-blue-main': 'hover:bg-[#01406c07]'}`}>
                                            {tab.displayed}
                                        </div>
                                    ))
                                }
                            </div>
                        }
                    </div>
                </>
            }
        </div>
    )
}

const MissionProgress = ({mission})=>{

    const levelsTheme = {
        Rookie: 'bg-amber-700/30! text-amber-700!',
        Apprentice: 'bg-amber-500/30! text-amber-500!',
        Intermediate: 'bg-blue-700/30! text-blue-700!',
        Challenger: 'bg-blue-500/30! text-blue-500!',
        Expert: 'bg-[#02616b30]! text-[#02616b]!',
        Master: 'bg-[#00aabc30]! text-[#00aabc]!',
        Senior: 'bg-[#03d69330]! text-[#03d693]!'
    }

    const role = {
        student: {
            user: {
                username: 'Hanniel',
                picture: 'none'
            },
            level: 'Intermediate',
            global_rate: 3.4
        }
    }

    const computeProgress = ()=>{
        const deadline = new Date(mission.deadline).getTime();
        const start_date = new Date(mission.start_date).getTime();
        const now = new Date().getTime();
        const duration = deadline - start_date;

        if (now < start_date)
            return 0;

        let elapsed = now - start_date;
        if (elapsed > duration) {
            elapsed = duration;
        }
        // 100% -> duration
        // percent -> elapsed
        const progressPercent = (100 * elapsed) / duration;
        return Math.round(progressPercent);
        // return elapsed;
    }
    const missionStatusLabel = {
        in_progress: 'In Progress',
        waiting_for_rate: 'Waiting for Rate',
        completed: 'Completed'
    }
    const {id} = useParams();
    const progressBrief = "Project timeline progress";
    const missionLevelBrief = "Define the complexity and expected experience for this mission. This sets the expectation for student applicants";


    return (
        <div className={`grid grid-cols-12 gap-3`}>
            <div className={`col-span-12 md:col-span-6 xl:col-span-8`}>
                <Card className={`bg-white p-4 py-5 border-0 shadow-sm!`}>
                    <h3 className={`roboto-semibold text-[19px] text-blue-focus`}>Project Activity</h3>
                    <div className={`flex items-center gap-2 mt-4`}>
                        <div className={`flex items-center gap-3 min-w-[40%] border-e border-gray-300`}>
                            <Avatar src={role.student.user.picture} alt={role.student.user.username} className={`w-[70px]! h-[70px]! bg-[#02616b21]! border! border-[#02616b45] text-sky-dark roboto`} />
                            <div className={``}>
                                <strong className={`font-normal text-[11px] text-gray-400 roboto-medium`}>STUDENT</strong>
                                <h6 className={`text-[17px] roboto-medium`}>{role.student.user.username}</h6>
                                <div className={`flex items-center gap-1`}>
                                    <Chip className={`p-1 px-4 roboto text-[11px]! ${levelsTheme[role.student.level]}`}>
                                        {role.student.level}
                                    </Chip>
                                    <div className={`flex items-center`}>
                                        <FaStar className={`text-yellow-400 text-[12px]`} />
                                        <p className={`roboto-medium ms-[3px] text-[13px] text-yellow-400`}>{role.student.global_rate}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`flex-1 flex justify-end px-5`}>
                            <div className="w-full">
                                <strong className={`font-normal roboto-medium text-[15px] text-gray-500`}>CURRENT PROGRESS</strong>
                                <div className={`flex mt-3 justify-between items-center`}>
                                    <p className={`text-[14px] text-black roboto`}>{progressBrief}</p>
                                    <div className={`flex items-center gap-1`}>
                                        <div className={`rounded-full p-0 bg-green-300/50`}>
                                            <GoDotFill className={`text-green text-[20px]`} />
                                        </div>
                                        <h6 className={`roboto-medium text-[15px]`}>{computeProgress()}%</h6>
                                    </div>
                                </div>
                                <LinearProgress determinate value={computeProgress()} className={`h-[15px] mt-1 rounded-full!`} sx={{
                                    '--LinearProgress-progressThickness': '13px',
                                    '--LinearProgress-radius': '999px',
                                }} />
                            </div>
                        </div>
                    </div>
                </Card>
                <Card className={`py-4 px-5 mt-5 bg-white shadow-sm!`}>
                    <FormLabel className={`roboto-medium text-[18px]!`}>
                        Mission Level
                    </FormLabel>
                    <p className={`roboto text-gray-500 text-[16px] mt-3`}>
                        {missionLevelBrief}
                    </p>
                    <div className={`mt-3`}>
                        <Chip className={`px-4 ${levelsTheme[mission.level]}`}>
                            {mission.level}
                        </Chip>
                    </div>
                </Card>
                <Card className={`py-4 px-5 rounded-2xl bg-white shadow-sm! mt-5`}>
                    <div className={`flex items-center`}>
                        <FormLabel className={`roboto-medium text-[18px]!`}>
                            Detailed Description
                        </FormLabel>
                    </div>
                    <div className={`mt-5`}>
                        <p className={`roboto-light`}>
                            {mission.description}
                        </p>
                    </div>
                </Card>

            </div>
            <div className={`col-span-12 md:col-span-6 xl:col-span-4`}>
                <Card className={`px-5 py-6! border-0! shadow-sm!`}>
                    <h4 className={`text-gray-400 roboto-medium text-[15px]`}>STATUS</h4>
                    <Chip variant='outlined' className={`rounded-md! mt-3 bg-green-600/10! p-1 px-4! border-[#00aabc30]!`} >
                        <div className={`flex items-center gap-3`}>
                            <div className={`rounded-full bg-[#00aabc40]`}>
                                <GoDotFill className={`text-[#00aabc]`}/>
                            </div>
                            <p className={`roboto text-[#00aabc]`}>{missionStatusLabel[mission.status]}</p>
                        </div>
                    </Chip>
                </Card>
                <Card className={`px-5 py-6! border-0! shadow-sm! mt-5`}>
                    <h4 className={`roboto-medium text-[15px]`}>REQUIRED SKILLS</h4>
                    <div className={`flex mt-3 flex-wrap gap-3`}>
                        {
                            mission.skills.map((skill)=>(
                                <Chip key={skill} className={`p-1 px-4! roboto bg-gray-200!`}>
                                    {skill}
                                </Chip>
                            ))
                        }
                    </div>
                </Card>
                <Card className={`px-5 py-6! border-0! shadow-sm! mt-5`}>
                    <h4 className={`roboto-medium text-[15px]`}>RENDER LINK</h4>
                    <div className={`w-full group rounded-md mt-3 h-[38px] bg-gray-200 px-3 select-none flex items-center gap-1`}>
                        <p className={`text-blue-main group-hover:underline line-clamp-1 cursor-pointer text-[14px] roboto max-w-[88%]`}>{mission.render_link}</p>
                        <div className={`flex flex-1 justify-end`}>
                            <FaExternalLinkAlt className={`text-gray-500`}/>
                        </div>
                    </div>
                </Card>
                <Card className={`px-5 py-6! border-0! shadow-sm! mt-5`}>
                    <h4 className={`roboto-medium text-[15px]`}>PUBLIC LINK</h4>
                    <div className={`w-full group rounded-md mt-3 h-[38px] bg-gray-100 px-3 select-none flex items-center gap-1`}>
                        <p className={`text-gray-600 group-hover:underline cursor-pointer text-[14px] line-clamp-1 roboto max-w-[88%]`}>http://localhost:5000/student/missions/{id}</p>
                        <div className={`flex flex-1 justify-end`}>
                            <IconButton>
                                <MdContentCopy className={`text-gray-500 text-[17px]`}/>
                            </IconButton>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}

const MissionContent = ({mission, setMission, editMode, setEditMode, activeTab})=>{

    // Variables
    const levelsTheme = {
        Rookie: 'bg-amber-700/30! text-amber-700!',
        Apprentice: 'bg-amber-500/30! text-amber-500!',
        Intermediate: 'bg-blue-700/30! text-blue-700!',
        Challenger: 'bg-blue-500/30! text-blue-500!',
        Expert: 'bg-[#02616b30]! text-[#02616b]!',
        Master: 'bg-[#00aabc30]! text-[#00aabc]!',
        Senior: 'bg-[#03d69330]! text-[#03d693]!'
    }
    const [loading, setLoading] = useState(false);
    const [mainError, setMainError] = useState(null);
    const [errors, setErrors] = useState({});
    const [editMission, setEditMission] = useState({
        ...mission,
        ['start_date']: toInputDate(mission.start_date),
        ['deadline']: toInputDate(mission.deadline)
    });
    const navigate = useNavigate();

    const {skills, setLogged, setProfile} = useContext(GlobalContext);
    const {id} = useParams();
    const [valuesChanged, setValuesChanged] = useState(false);

    // Effects
    useEffect(()=>{
        if (activeTab !== 'applications') {
            handleCancel();
            setEditMode(false);
        }
    }, [activeTab])

    useEffect(()=>{
        setValuesChanged(hasChanged());
    }, [editMission])

    // handlers

    const handleChange = (event)=>{
        setEditMission({
            ...editMission,
            [event.target.name]: event.target.value
        })
    }

    const hasChanged = ()=>{
        return Object.keys(editMission).some((key)=>{
            let val1 = editMission[key];
            let val2 = mission[key];

            if (key === 'deadline' || key === 'start_date') {
                return val1 !== toInputDate(val2);
            }

            if (Array.isArray(val1) && Array.isArray(val2)) {
                return JSON.stringify(val1) !== JSON.stringify(val2);
            }
            return val1 !== val2;
        })
    }
    
    const apiErrorHandler = (error)=>{
        if (error.response) {
                const data = error.response.data;
                console.log(data);
                if (error.response.status === 401 && data.code && data.code === 'token_not_valid') {
                    setLogged(false);
                    setProfile({});
                    navigate('/login');
                } else if (error.response.status === 401 && data.details === 'Authentication credentials were not provided.') {
                    setLogged(false);
                    setProfile({});
                    navigate('/login');
                } else if (error.response.status === 400) {
                    setMainError({
                        fr: "Quelque chose s'est mal passé",
                        en: "Something went wrong"
                    })
                }
            } else {
                setMainError({
                    en: "Connection to server fails, check your network",
                    fr: "La connexion au serveur à échouer, vérifiez votre connexion internet"
                })
            }
    }

    const apiSuccessHandler = (data)=>{
        
        setMission(editMission);
        setEditMode(false);
    }

    const updateHandler = ()=>{
        if (loading)
            return;
        setErrors({});
        setMainError(null);
        let rules = missionRules;
        rules.skills.choices.value = skills;

        const formErrors = Validator.validate(editMission, missionRules);

        // Check error
        if (Object.keys(formErrors).length === 0) {
            
            Connection.put(`company/missions/${id}/`, editMission, apiSuccessHandler, apiErrorHandler, setLoading, true);
        } else {
            setErrors({...formErrors});
        }

    }

    const handleCancel = ()=>{
        if (loading)
            return;
        setEditMission({
            ...mission,
            ['start_date']: toInputDate(mission.start_date),
            ['deadline']: toInputDate(mission.deadline)
        })
        setMainError(null);
        setErrors({});
        setEditMode(false);
    }

    const missionLevelBrief = "Define the complexity and expected experience for this mission. This sets the expectation for student applicants";
    

    return (
        <div className={`grid grid-cols-12 gap-3`}>
            <div className={`col-span-12 md:col-span-6 xl:col-span-8`}>
                {
                    editMode &&
                    <div className={`mb-5 py-4 px-5 bg-white shadow-sm rounded-2xl`}>
                        <FormLabel className={`roboto-medium text-[18px]!`}>
                            Mission name
                        </FormLabel>
                        <Input placeholder="" className={`roboto mt-3`} value={editMission.name} name="name" onChange={handleChange} />
                        {
                            errors.name && <ErrorBox content={errors.name} />
                        }
                    </div>
                }
                <div className={`py-4 px-5 rounded-2xl bg-white shadow-sm`}>
                    <FormLabel className={`roboto-medium text-[18px]!`}>
                        Mission Level
                    </FormLabel>
                    <p className={`roboto text-gray-500 text-[16px] mt-3`}>
                        {missionLevelBrief}
                    </p>
                    <div className={`mt-3`}>
                        {
                            editMode ?
                            <>
                                <Select value={editMission.level} name="level" onChange={(e, value)=>{
                                    setEditMission({
                                        ...editMission,
                                        ['level']: value
                                    })
                                }}>
                                    {
                                        ['Rookie', 'Apprentice', 'Intermediate', 'Challenger', 'Expert', 'Master', 'Senior'].map((level)=>(
                                            <Option key={level} value={level}>
                                                {level}
                                            </Option>
                                        ))
                                    }
                                </Select>
                                {
                                    errors.level && <ErrorBox content={errors.level} />
                                }
                            </>:
                            <Chip className={`px-4 ${levelsTheme[mission.level]}`}>
                                {mission.level}
                            </Chip>

                        }
                    </div>
                </div>
                <div className={`py-4 px-5 rounded-2xl bg-white shadow-sm mt-5`}>
                    <div className={`flex items-center`}>
                        <FormLabel className={`roboto-medium text-[18px]!`}>
                            Detailed Description
                        </FormLabel>
                    </div>
                    <div className={`mt-5`}>
                        {
                            editMode ?
                            <Textarea minRows={8} value={editMission.description} name="description" onChange={handleChange} className={`roboto`} />:
                            <p className={`roboto-light`}>
                                {editMission.description}
                            </p>
                        }
                        {
                            editMode && errors.description && <ErrorBox content={errors.description} />
                        }
                    </div>
                </div>
                <div className={`py-4 px-5 rounded-2xl bg-white shadow-sm my-5`}>
                    <FormLabel className={`roboto-medium text-[18px]!`}>
                        Render link
                    </FormLabel>
                    {
                        editMode ?
                        <Input type='url' value={editMission.render_link} name="render_link" onChange={handleChange} className={`mt-3`} />:
                        <p className={`mt-3 roboto text-gray-500`}>
                            {mission.render_link}
                        </p>
                    }
                    {
                        editMode && errors.render_link && <ErrorBox content={errors.render_link} />
                    }
                </div>
            </div>

            <div className={`col-span-12 md:col-span-6 xl:col-span-4`}>

                <div className={`bg-white py-4 px-4 shadow-sm rounded-2xl`}>
                    <h5 className={`roboto-medium text-[18px]!`}>
                        Timeline
                    </h5>
                    <div className={`mt-4`}>
                        <FormControl className={``}>
                            <FormLabel className={`roboto text-[16px]! text-gray-600!`}>Start date</FormLabel>
                            {
                                editMode ?
                                <Input type='date' value={editMission.start_date} name='start_date' onChange={handleChange} />:
                                <p className={`roboto`}>{formatDate(mission.start_date)}</p>
                            }
                            {
                                editMode && errors.start_date && <ErrorBox content={errors.start_date} />
                            }
                        </FormControl>
                        <FormControl className={`mt-5`}>
                            <FormLabel className={`roboto text-gray-600! text-[16px]!`}>Deadline</FormLabel>
                            {
                                editMode ?
                                <Input type='date' value={editMission.deadline} name='deadline' onChange={handleChange} />:
                                <p className={`roboto`}>{formatDate(mission.deadline)}</p>
                            }
                            {
                                editMode && errors.deadline && <ErrorBox content={errors.deadline} />
                            }
                        </FormControl>
                    </div>
                </div>

                <div className={`bg-white py-4 mt-5 px-4 shadow-sm rounded-2xl`}>
                    <FormLabel className={`text-[18px]! roboto-medium`}>Required skills</FormLabel>
                    <div className={`my-5 flex flex-wrap gap-3`}>
                        {
                            !editMode && editMission.skills.map((skill)=>(
                                <Chip key={skill} variant='outlined' className={`p-1 px-4 rounded-md!`}>
                                    {skill}
                                </Chip>
                            ))
                        }
                        {
                            editMode &&
                            <>
                                <Autocomplete
                                    multiple
                                    value={editMission.skills}
                                    getOptionLabel={(option)=>option}
                                    options={skills}
                                    placeholder="Select skills"
                                    onChange={(e, values)=>{
                                        if (values != editMission.skills)
                                            setEditMission({
                                                ...editMission,
                                                ['skills']: values
                                            })
                                    }}
                                />
                                {
                                    errors.skills && <ErrorBox content={errors.skills}/>
                                }
                            </>
                        }
                    </div>
                </div>

                <div className={`bg-white py-4 mt-5 px-4 shadow-sm rounded-2xl`}>
                    <div className={`flex items-center gap-2`}>
                        <MdLink className={`text-[20px]`}/>
                        <FormLabel className={`text-[18px]! roboto-medium`}>Public Link</FormLabel>
                    </div>
                    <div className={`my-5 flex items-center gap-3`}>
                        <Input disabled value={`http://localhost:5000/company/missions/${id}`} className={``} />
                        <div className={`px-[2.2px] py-px rounded-sm border border-gray-200`}>
                            <IconButton>
                                <MdContentCopy className={`text-[16px]`}/>
                            </IconButton>
                        </div>
                    </div>
                </div>
                {
                    editMode &&
                    
                    <div className={`py-4 mt-5 px-4 gap-3 h-[100px]`}>
                        {
                            mainError && <ErrorBox content={mainError}/>
                        }
                        <div className={`flex gap-3 items-center justify-end`}>
                            <Button disabled={loading} onClick={handleCancel} variant="outlined" sx={{
                                textTransform: 'none'
                            }} className={`w-[124px] h-[38px] roboto text-gray-400! border-gray-300! bg-gray-50! border-2!`}>
                                Cancel
                            </Button>
                            {
                                valuesChanged === true && 
                                <Button onClick={updateHandler} disabled={loading} sx={{
                                    textTransform: 'none'
                                }} className={`w-[124px] h-[38px] roboto bg-blue-main text-white!`}>
                                    {
                                        loading ?
                                        <CircularProgress size={21} sx={{
                                            color: 'white'
                                        }} />:
                                        <>Update</>
                                    }
                                </Button>
                            }
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

const Applications = ({applications=[], setApplications})=>{

    const [showApplicantDetails, setShowApplicantDetails] = useState(false);
    const [displayedApplication, setDisplayedApplication] = useState(null);
    const [displayedApplicationId, setDisplayedApplicationId] = useState(-1);

    const handleEditConfirmation = (data)=>{
        setApplications(data.applications)
    }

    const statusSettings = {
        pending: {
            class: 'text-amber-600! border-amber-600! bg-amber-200/20',
            text: 'Pending'
        },
        confirmed: {
            class: 'text-green-500! border-green-500! bg-green-200/20!',
            text: 'Confirmed'
        },
        'not-validated': {
            class: 'text-red-500! border-red-500! bg-red-200/20',
            text: 'Declined'
        }
    }


    return (
        <div className={`pt-10`}>
            {
                applications.length === 0 &&
                <div className={`w-full text-center`}>
                    <strong className={`text-center mt-5 font-normal roboto-medium text-gray-main`}>No applications yet.</strong>
                </div>
            }
            <div className={`grid grid-cols-12 gap-4`}>
            {
                displayedApplication &&
                <ApplicantProfile onEditConfirm={handleEditConfirmation} appId={displayedApplicationId} show={showApplicantDetails} onHide={()=>setDisplayedApplication(false)} applicant={displayedApplication} />
            }
            {
                applications.map((app, index)=>(
                    <div className={`col-span-6 bg-white xl:col-span-3 shadow-2xs flex gap-5 items-center p-4 border border-gray-200 rounded-xl`} key={index}>
                        <Avatar src={MEDIA_API + app.student.user.picture} alt={app.student.user.username} className={`bg-blue-main`} />
                        {/* <p>{app.user.picture}</p> */}
                        <div className={`w-[60%]`}>
                            <div className="flex items-center gap-2">
                                <h6 className={`roboto`}>{app.student.user.username}</h6>
                                <Chip variant='outlined' className={`px-4 text-[11px]! ${statusSettings[app.status].class} `}>
                                    {statusSettings[app.status].text}
                                </Chip>
                            </div>
                            <p className={`flex items-center text-gray-main text-[14px] roboto-light`}>
                                {app.student.global_rate}
                                <FaStar className={`ms-2`}/>
                            </p>
                        </div>
                        <div className={`flex items-center justify-end`}>
                        <Button onClick={()=>{
                            setDisplayedApplicationId(app.id)
                            setDisplayedApplication({
                                ...app.student,
                                ["status"]: app.status
                            })
                            setShowApplicantDetails(true)
                        }} sx={{
                            textTransform: 'none'
                        }} className={`border text-blue-main text-[14px]! bg-[#00aabc12]! text-sky roboto-light`}>
                            Details
                        </Button>
                        </div>
                    </div>
                ))
            }
            </div>
        </div>
    )
}

function Content({mission, setMission, loading, applications, setApplications}) {

    const [activeTab, setActiveTab] = useState('overview');
    const [editMode, setEditMode] = useState(false);

    return (
        <div className="pt-10">
            <Header loading={loading} editMode={editMode} setEditMode={setEditMode} mission={mission} activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className={`pt-5`}>
            {
                loading &&
                <div className="mt-5 flex items-center justify-center">
                    <CircularProgress size={27}/>
                </div>
            }
            {
                !loading && activeTab === 'overview' && mission.status === 'not_started' &&
                <MissionContent setEditMode={setEditMode} activeTab={activeTab} mission={mission} setMission={setMission} editMode={editMode} />
            }
            {
                !loading && activeTab === 'applications' && <Applications setApplications={setApplications} applications={applications} />
            }
            {
                !loading && mission && mission.status !== 'not_started' &&
                <MissionProgress mission={mission} />
            }
            </div>
        </div>
    )
}

function MissionDetails() {

    const [loading, setLoading] = useState(true);
    const {id} = useParams();
    const navigate = useNavigate();
    const [mainError, setMainError] = useState(null);
    const {setLogged, setProfile} = useContext(GlobalContext);

    const fetchMissionDetails = ()=>{
        Connection.get(`company/missions/${id}/`, (data)=>{
            setMission(data.mission);
            setApplications(data.applications);
        }, (error)=>{
            setLoading(false);
            if (error.response) {
                const data = error.response.data;
                console.log(data);
                if (error.response.status === 401 && data.code && data.code === 'token_not_valid') {
                    setLogged(false);
                    setProfile({});
                    navigate('/login');
                } else if (error.response.status === 401 && data.details === 'Authentication credentials were not provided.') {
                    setLogged(false);
                    setProfile({});
                    navigate('/login');
                } else if (error.response.status === 400) {
                    setMainError({
                        fr: "Erreur inattendue",
                        en: "Unexpected error"
                    })
                }
            } else {
                setMainError({
                    en: "Connection to server fails, check your network",
                    fr: "La connexion au serveur à échouer, vérifiez votre connexion internet"
                })
            }
        }, setLoading, true)
    }

    useEffect(()=>{
        document.title = 'Mission details - STM';
        window.scrollTo({top: 0, behavior: 'smooth'});
        fetchMissionDetails();
    }, [])

    const [applications, setApplications] = useState([]);
    const [mission, setMission] = useState({
        uuid: 'cGjsio',
        name: 'Landing Page Redesign',
        description: 'Redesign and implement a responsive landing page to improve conversion and accessibility. Deliver Figma mockups and a production-ready React component set.',
        status: 'not-started',
        start_date: '2025-12-01',
        deadline: '2025-12-30',
        picture: cover,
        role: {
            title: 'Frontend Developer',
            skills: ['React', 'HTML/CSS', 'Responsive Design', 'A11y', 'Figma']
        },
        applications: [
            {
                uuid: 'uWnncs',
                username: 'John Doeee',
                rate: 3.4,
                picture: 'https://randomuser.me/api/portraits/men/53.jpg'
            },
            {
                uuid: 'chJic',
                username: 'Romain Molina',
                rate: 4.7,
                picture: 'https://randomuser.me/api/portraits/men/64.jpg'
            },
            {
                uuid: 'fHhbbc',
                username: 'Thomas Dyer',
                rate: 4.1,
                picture: 'https://randomuser.me/api/portraits/men/74.jpg'
            },
            {
                uuid: 'ptoKcj',
                username: 'Teddy Brow',
                rate: 1.2,
                picture: ''
            }
        ]
    })

    return (
        <div className={`bg-gray-50 min-h-screen`}>
            <CompanyNavigation current="missions" />
            <Container className="pt-16 md:pt-20">
                <Content loading={loading} mission={mission} setMission={setMission} applications={applications} setApplications={setApplications}  />
            </Container>
        </div>
    )
}

export default MissionDetails;
