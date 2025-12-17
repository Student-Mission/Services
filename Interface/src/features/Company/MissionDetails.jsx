import { useContext, useEffect, useState } from "react";
import CompanyNavigation from "../../components/layout/CompanyNavigation";
import Container from "../../components/layout/Container";
import { Avatar, Button, CircularProgress, IconButton } from "@mui/material";
import cover from "../../assets/images/cover.png";
import { FaCalendar, FaStar } from "react-icons/fa";
import dayjs from "dayjs";
import 'dayjs/locale/fr';
import utc from "dayjs/plugin/utc";
import { Autocomplete, Breadcrumbs, FormControl, FormLabel, Input, Link, Option, Select, Textarea, Typography, Chip as JChip } from "@mui/joy";
import Connection from "../../services/Connection";
import { useNavigate, useParams } from "react-router-dom";
import { GlobalContext } from "../../contexts/Global";
import ImageInput from "../../components/ui/ImageInput";
import { missionRules, roleRules } from "./rules/new_mission";
import Validator from "../../lib/validations/validator";
import ErrorBox from "../../components/ui/ErrorBox";
import { MdContentCopy, MdLink } from "react-icons/md";

dayjs.locale('fr');
dayjs.extend(utc);

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
                                <h1 className={`roboto-semibold text-[27px] wrap-break-word`}>{mission.name}</h1>
                            </div>
                            <div className={``}>
                                <Button sx={{
                                    textTransform: 'none'
                                }} className={`bg-blue-main text-white! h-[38px]`}>
                                    Update mission
                                </Button>
                            </div>
                        </div>
                        <div className={`mt-5 border-b border-gray-100 flex items-center gap-2`}>
                            {
                                tabs.map((tab)=>(
                                    <div onClick={()=>setActiveTab(tab.value)} key={tab.value} className={`px-3 py-3 roboto border-b-2 cursor-pointer border-transparent ${activeTab === tab.value ? 'border-[#01406c]! bg-[#01406c07] text-blue-main': 'hover:bg-[#01406c07]'}`}>
                                        {tab.displayed}
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

const MissionContent = ({mission, setMission, editMode, setEditMode, activeTab})=>{

    // Variables
    const [loading, setLoading] = useState(false);
    const [mainError, setMainError] = useState(null);
    const [errors, setErrors] = useState([]);
    const [editMission, setEditMission] = useState({
        ...mission,
        ['role']: {
            title: mission.role.title,
            skills: rawSkillsToLabels(mission.role.skills)
        },
        ['start_date']: toInputDate(mission.start_date),
        ['deadline']: toInputDate(mission.deadline)
    });
    const [picture, setPicture] = useState(mission.picture);
    const [pictureURL, setPictureURL] = useState('');
    const navigate = useNavigate();

    const {skills, setLogged, setProfile} = useContext(GlobalContext);
    const {id} = useParams();

    // Effects
    useEffect(()=>{
        if (activeTab !== 'applications') {
            // alert('Update form')
            setEditMode(false);
        }
    }, [activeTab])

    useEffect(()=>{
        if (!picture) {
            setPictureURL('');
            return;
        }
        if (picture instanceof Blob) {
            const url = URL.createObjectURL(picture);
            setPictureURL(url);
            return ()=>{
                URL.revokeObjectURL(url);
            }
        } else {
            setPictureURL(picture);
        }
    }, [picture])


    
    // handlers

    const handleChange = (event)=>{
        setEditMission({
            ...editMission,
            [event.target.name]: event.target.value
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
        setErrors({});
        setMainError(null);
        const form = new FormData();
        let rules = {...missionRules};
        const customRoleRules = {
            title: roleRules.name,
            skills: roleRules.skills
        }
        let newMissionForm = editMission;
        const newRoleForm = {
            title: editMission.role.title,
            skills: labelSkillsToRaw(editMission.role.skills)
        }
        

        const formErrors = Validator.validate(editMission, rules);
        const roleErrors = Validator.validate(newRoleForm, customRoleRules);
        
        // Check error
        if (Object.keys(formErrors).length === 0 && Object.keys(roleErrors).length === 0) {
            // console.log(editMission);
            // return;
            if (!picture) {
                setErrors({
                    picture: {
                        fr: "L'image du project est requis",
                        en: "Project image is required"
                    }
                })
                return;
            }
            if (picture instanceof Blob) {
                const sizeMb = (picture.size / (1024*1024).toFixed(2));
                if (sizeMb > 1) {
                    setErrors({
                        picture: {
                            fr: "La taille de l'image ne doit pas excéder 1Mo",
                            en: "Image size must not exceed 1MB"
                        }
                    })
                    return;
                }
                form.append('picture', picture);
            }
            // Add data
            form.append('mission',JSON.stringify(newMissionForm));
            form.append('role', JSON.stringify(newRoleForm));
            Connection.post(`business/missions/${id}/edit/`, form, apiSuccessHandler, apiErrorHandler, setLoading, true);
        } else {
            setErrors({...formErrors, ...roleErrors});
        }

    }

    const handleCancel = ()=>{
        setEditMission({
            ...mission,
            ['role']: {
                title: mission.role.title,
                skills: rawSkillsToLabels(mission.role.skills)
            },
            ['start_date']: toInputDate(mission.start_date),
            ['deadline']: toInputDate(mission.deadline)
        })
        setEditMode(false);
    }

    // const {id} = useParams();

    const missionLevelBrief = "Define the complexity and expected experience for this mission. This sets the expectation for student applicants";

    return (
        <div className={`grid grid-cols-12 gap-3`}>
            <div className={`col-span-12 md:col-span-6 xl:col-span-8`}>
                <div className={`py-4 px-5 rounded-2xl bg-white shadow-sm`}>
                    <FormLabel className={`roboto-medium text-[18px]!`}>
                        Mission Level
                    </FormLabel>
                    <p className={`roboto text-gray-500 text-[16px] mt-3`}>
                        {missionLevelBrief}
                    </p>
                    <div className={`mt-3`}>
                        <Select value={'Apprentice'}>
                            {
                                ['Rookie', 'Apprentice', 'Intermediate', 'Challenger', 'Expert', 'Master', 'Senior'].map((level)=>(
                                    <Option value={level}>
                                        {level}
                                    </Option>
                                ))
                            }
                        </Select>
                    </div>
                </div>
                <div className={`py-4 px-5 rounded-2xl bg-white shadow-sm mt-5`}>
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
                </div>
                <div className={`py-4 px-5 rounded-2xl bg-white shadow-sm mt-5`}>
                    <FormLabel className={`roboto-medium text-[18px]!`}>
                        Render link
                    </FormLabel>
                    <p className={`mt-3 roboto text-gray-500`}>
                        {mission.render_link}
                    </p>
                </div>
            </div>

            <div className={`col-span-12 md:col-span-6 xl:col-span-4`}>
                <div className={`bg-white py-4 px-5 shadow-sm rounded-2xl`}>
                    <FormLabel className={`roboto-medium text-[18px]!`}>
                        Status
                    </FormLabel>
                    <Select value={'Not started'} className={`mt-3`}>
                        {
                            ['Not started', 'In progress', 'Completed'].map((value)=>(
                                <Option key={value}>
                                    {value}
                                </Option>
                            ))
                        }
                    </Select>
                </div>

                <div className={`bg-white py-4 mt-5 px-4 shadow-sm rounded-2xl`}>
                    <h5 className={`roboto-medium text-[18px]!`}>
                        Timeline
                    </h5>
                    <div className={`mt-4`}>
                        <FormControl className={``}>
                            <FormLabel className={`roboto text-[16px]! text-gray-600!`}>Start date</FormLabel>
                            <Input type='date' value={mission.start_date} />
                        </FormControl>
                        <FormControl className={`mt-5`}>
                            <FormLabel className={`roboto text-gray-600! text-[16px]!`}>Deadline</FormLabel>
                            <Input type='date' value={mission.deadline} />
                        </FormControl>
                    </div>
                </div>

                <div className={`bg-white py-4 mt-5 px-4 shadow-sm rounded-2xl`}>
                    <FormLabel className={`text-[18px]! roboto-medium`}>Required skills</FormLabel>
                    <div className={`my-5 flex flex-wrap gap-3`}>
                        <Autocomplete
                            multiple
                            value={rawSkillsToLabels(['C++', 'C#'])}
                            options={rawSkillsToLabels(['C++', 'C#', 'Raylib'])}
                            placeholder="Select skills"
                        />
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
            </div>
        </div>
    )
}

const Applications = ({applications=[]})=>{

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
                applications.map((app, index)=>(
                    <div className={`col-span-6 xl:col-span-3 shadow-2xs flex gap-5 items-center p-4 border border-gray-200 rounded-xl `} key={index}>
                        <Avatar src={app.picture === ''? 'none': app.picture} alt={app.username} className={`bg-blue-main`} />
                        <div className={`w-[60%]`}>
                            <h6 className={`roboto`}>{app.username}</h6>
                            <p className={`flex items-center text-gray-main text-[14px] roboto-light`}>
                                {app.rate}
                                <FaStar className={`ms-2`}/>
                            </p>
                        </div>
                        <div className={`flex items-center justify-end`}>
                        <Button sx={{
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

function Content({mission, setMission, loading}) {

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
                !loading && activeTab === 'overview' && <MissionContent setEditMode={setEditMode} activeTab={activeTab} mission={mission} setMission={setMission} editMode={editMode} />
            }
            {
                !loading && activeTab === 'applications' && <Applications applications={mission.applications} />
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
        Connection.get(`business/missions/${id}/`, (data)=>{
            setMission(data.mission);
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
        const timer = setTimeout(()=>{
            fetchMissionDetails();
        }, 2000)

        return ()=>{
            clearTimeout(timer);
        }
    }, [])

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
                <Content loading={loading} mission={mission} setMission={setMission} />
            </Container>
        </div>
    )
}

export default MissionDetails;
