import { useContext, useEffect, useState } from "react";
import CompanyNavigation from "../../components/layout/CompanyNavigation";
import Container from "../../components/layout/Container";
import { Avatar, Button, Chip, CircularProgress } from "@mui/material";
import cover from "../../assets/images/cover.png";
import { FaCalendar, FaStar } from "react-icons/fa";
import dayjs from "dayjs";
import 'dayjs/locale/fr';
import utc from "dayjs/plugin/utc";
import { Autocomplete, FormControl, FormLabel, Input, Textarea } from "@mui/joy";
import Connection from "../../services/Connection";
import { useNavigate, useParams } from "react-router-dom";
import { GlobalContext } from "../../contexts/Global";
import ImageInput from "../../components/ui/ImageInput";
import { missionRules, roleRules } from "./rules/new_mission";
import Validator from "../../lib/validations/validator";
import ErrorBox from "../../components/ui/ErrorBox";

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
                    <h2 className={`roboto-medium text-blue-focus text-[24px]`}>{mission.name}</h2>
                    <div className="flex items-center gap-4 mt-4">
                        <Chip label={statusDisplayable[mission.status]} className={`roboto-medium border! ${statusThemes[mission.status].text + ' ' + statusThemes[mission.status].bg + ' ' + statusThemes[mission.status].border}`} />
                        {
                            activeTab === 'overview' && !editMode &&
                            <Button onClick={()=>setEditMode(!editMode)} sx={{
                                textTransform: "none",

                            }} className={`bg-blue-main text-white! h-[30px]`}>
                                Edit
                            </Button>
                        }
                    </div>

                    <div className={`flex mt-10 items-center gap-3`}>
                        {
                            tabs.map((tab, index)=>(
                                <Button sx={{
                                    textTransform: 'none'
                                }} onClick={()=>setActiveTab(tab.value)}
                                variant='text' key={index} className={`pb-2 pt-2 cursor-pointer  rounded-none! text-[#8b8b8b]! roboto-medium transition-colors duration-200 ease-in-out text-[15px] ps-3 pe-3 flex items-center justify-center ${tab.value === activeTab ? 'text-[#02616b]! border-[#02616b]! border-b-2!': ' hover:text-[#02616b]!'}`}>
                                    {tab.displayed}
                                </Button>
                            ))
                        }
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

    return (
        <div className={``}>
            <div className={`w-full xl:w-[45%]`}>
                {
                    editMode &&
                    <FormControl className="mb-5">
                        <FormLabel className={`roboto-medium text-[17px]! text-blue-focus`}>Name</FormLabel>
                        <Input value={editMission.name} onChange={handleChange} name="name" />
                        {
                            errors.name && <ErrorBox content={errors.name} />
                        }
                    </FormControl>
                }
                <h5 className={`roboto-medium text-[17px] text-blue-focus`}>Description</h5>
                {
                    editMode ?
                    <div>
                        <Textarea minRows={7} value={editMission.description} onChange={handleChange} name="description" />
                        {
                            errors.description && <ErrorBox content={errors.description} />
                        }
                    </div>:
                    <p className={`roboto-light mt-4`}>{mission.description}</p>
                
                }
            </div>
            <div className={`mt-7 xl:w-[45%]`}>
                <h5 className={`text-[17px] text-blue-focus roboto-medium`}>Role</h5>
                {
                    !editMode ?
                    <>
                        <p className={`mt-1 roboto-light text-[15px]`}>{mission.role.title}</p>
                        <div className={`flex mt-3 flex-wrap gap-5`}>
                            {
                                labelSkillsToRaw(editMission.role.skills).map((skill, index)=>(
                                    <Chip label={skill} key={index} className={`roboto-light`} />
                                ))
                            }
                        </div>
                    </>:
                    <div className="mt-3">
                        <div>
                            <Input value={editMission.role.title} onChange={(e)=>{
                                let roleTMP = editMission.role;
                                roleTMP.title = e.target.value;
                                setEditMission({
                                    ...editMission,
                                    ['role']: roleTMP
                                })
                            }} className="h-[45px]" />
                            {
                                errors.title && <ErrorBox content={errors.title} />
                            }
                        </div>
                        <div>
                            <Autocomplete
                                multiple
                                placeholder="Select skills"
                                options={skills}
                                value={editMission.role.skills}
                                onChange={(e, newSkills)=>{
                                    let roleTMP = editMission.role;
                                    roleTMP.skills = newSkills
                                    setEditMission({
                                        ...editMission,
                                        ['role']: roleTMP
                                    })
                                }}
                                className={`mt-4 h-[45px]`}
                            />
                            {
                                errors.skills && <ErrorBox content={errors.skills} />
                            }
                        </div>
                    </div>
                }
            </div>
            <div className={`mt-7`}>
                <div className={`flex items-start gap-3`}>
                    <FaCalendar className={`text-gray-main mt-1 text-lg`}/>
                    <div className={``}>
                        <p className={`roboto-light text-[14px]`}>Start date</p>
                        {
                            editMode ?
                            <div>
                                <Input type='date' value={editMission.start_date} name="start_date" onChange={handleChange} className="mt-2" />
                                {
                                    errors.start_date && <ErrorBox content={errors.start_date} />
                                }
                            </div>:
                            <strong className={`mt-2 text-[15px] font-normal roboto-medium text-blue-focus`}>{formatDate(mission.start_date)}</strong>
                        }
                    </div>
                </div>
                <div className={`flex items-start gap-3 mt-4`}>
                    <FaCalendar className={`text-gray-main mt-1 text-lg`}/>
                    <div className={``}>
                        <p className={`roboto-light text-[14px]`}>Due date</p>
                        {
                            editMode ?
                            <div>
                                <Input type='date' value={editMission.deadline} name="deadline" onChange={handleChange} className="mt-2" />
                                {
                                    errors.deadline && <ErrorBox content={errors.deadline} />
                                }
                            </div>:
                            <strong className={`mt-2 text-[15px] font-normal roboto-medium text-blue-focus`}>{formatDate(mission.deadline)}</strong>
                        }
                    </div>
                </div>
            </div>
            <div className={`xl:w-[45%] mt-7`}>
                {
                    editMode ?
                    <div>
                        <ImageInput defaultLabel={editMission.picture} ID={'edit-picture'} setImage={setPicture} className="w-full cursor-pointer md:w-[80%] lg:w-[65%] xl:w-[50%]" />
                        {
                            errors.picture && <ErrorBox content={errors.picture} />
                        }
                    </div>:
                    <img src={pictureURL} alt="mission pic" className={`w-full md:w-[80%] lg:w-[65%] xl:w-[50%]`} />
                }
            </div>
            {
                mainError && <ErrorBox content={mainError} className="mt-7" />
            }
            <div className={`flex mt-4 mb-7 gap-4 items-center justify-end w-full md:w-[80%] lg:w-[65%] xl:w-[50%]`}>
                {
                    !loading && editMode &&
                    <Button onClick={handleCancel} sx={{
                        textTransform: 'none'
                    }} variant='outlined' className={`w-[100px] h-[38px] text-blue-main`}>
                        Cancel
                    </Button>
                }
                {
                    editMode && 
                    <Button onClick={updateHandler} disabled={loading} sx={{
                        textTransform: 'none'
                    }} className={`w-[100px] h-[38px] bg-blue-main text-white! roboto-medium`}>
                        {
                            loading ?
                            <CircularProgress size={16} sx={{
                                color: 'white'
                            }} />:<>Update</>
                        }
                    </Button>
                }
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
        <div>
            <CompanyNavigation current="missions" />
            <Container className="mt-16 md:mt-20">
                <Content loading={loading} mission={mission} setMission={setMission} />
            </Container>
        </div>
    )
}

export default MissionDetails;
