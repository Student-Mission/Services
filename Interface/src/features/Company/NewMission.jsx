import { useContext, useEffect, useState } from "react";
import CompanyNavigation from "../../components/layout/CompanyNavigation";
import Container from "../../components/layout/Container";
import { FormControl, FormLabel, Input, MenuItem, Select, Step, StepButton, StepIndicator, Stepper, Textarea, Autocomplete, Option } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import RateField from "../../components/ui/RateField";
import { Button, CircularProgress } from "@mui/material";
import ImageInput from "../../components/ui/ImageInput";
import { missionRules, rateRules, roleRules } from "./rules/new_mission";
import Validator from '../../lib/validations/validator';
import ErrorBox from "../../components/ui/ErrorBox"
import Connection from "../../services/Connection";
import { GlobalContext } from "../../contexts/Global";


function Content() {

    const steps = ['Missions details', 'Picture', 'Role'];
    const [activeStep, setActiveStep] = useState(0);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);


    const [mission, setMission] = useState({
        name: "",
        description: "",
        start_date: "",
        deadline: "",
        render_mode: "",
        render_link: ""
    })
    const [picture, setPicture] = useState(null);
    const [errors, setErrors] = useState({});
    const [mainError, setMainError] = useState({});

    const [role, setRole] = useState({
        name: '',
        skills: []
    })

    const [rate, setRate] = useState(1);

    const handleFirstStepChange = (event)=>{
        setMission({
            ...mission,
            [event.target.name]: event.target.value
        })
    }

    const {setProfile, setLogged, skills} = useContext(GlobalContext);

    // Utils
    const formatSkills = (_skills)=>{
        let newSkills = [];
        _skills.map((skill)=>{
            newSkills.push(skill.label);
        })
        return newSkills;
    }

    // Submits
    const handleFirstStepSubmit = ()=>{
        setErrors({});
        const tmpErrors = Validator.validate(mission, missionRules);
        const rateError = Validator.validate({rate}, {rate: rateRules});

        if (Object.keys(tmpErrors).length === 0 && Object.keys(rateError).length === 0) {
            setActiveStep(1);
        } else {
            setErrors((prev)=>(
                {...tmpErrors, ...rateError}
            ))
        }
    }

    const handleSecondStepSubmit = ()=>{
        setErrors({});
        if (!picture) {
            setErrors({
                picture: {
                    fr: "Une illustration de la mission est requise",
                    en: "A mission picture is required"
                }
            })
            return;
        }
        // Check file size
        const fileSizeMB = (picture.size / (1024*1024)).toFixed(2);
        if (fileSizeMB > 1) {
            setErrors({
                picture: {
                    fr: "L'image ne doit pas excéder 1Mo",
                    en: "Picture must not exceed 1MB"
                }
            })
            return;
        }
        setActiveStep(2);
    }

    const handleFinalSubmit = ()=>{
        setErrors({});
        let roleForm = {
            name: role.name,
            skills: formatSkills(role.skills)
        }
        const tmpErrors = Validator.validate(roleForm, roleRules);

        if (Object.keys(tmpErrors).length === 0) {
            submitMissionForm();
        } else {
            setErrors(tmpErrors);
        }
    }

    const handleNextClick = ()=>{
        if (activeStep === 0)
            handleFirstStepSubmit();
        if (activeStep === 1)
            handleSecondStepSubmit();
    }

    const submitMissionForm = ()=>{
        const form = new FormData();
        const newRoleForm = {
            title: role.name,
            skills: formatSkills(role.skills)
        }
        const newMissionForm = {
            ...mission,
            ['rate']: rate
        }

        form.append('role', JSON.stringify(newRoleForm));
        form.append('picture', picture);
        form.append('mission', JSON.stringify(newMissionForm));

        Connection.post('business/mission/add/', form, (data)=>{
            navigate('/company/missions');
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
                }
            } else {
                setMainError({
                    en: "Connection to server fails, check your network",
                    fr: "La connexion au serveur à échouer, vérifiez votre connexion internet"
                })
            }
        }, setLoading, true);
    }



    return (
        <div className={`mt-24`}>
            <div className={`w-full flex items-center justify-center`}>
                <Stepper sx={{
                    width: {
                        xs: '100%',
                        sm: '80%',
                        md: '60%',
                        xl: '50%'
                    }
                }}>
                    {
                        steps.map((step, index)=>(
                            <Step key={index} className={``} 

                                indicator={
                                    <StepIndicator
                                        sx={{
                                            fontFamily: 'Inter medium',
                                            color: ()=>{
                                                if (activeStep < index)
                                                    return '#6B7280'
                                                else if (activeStep === index)
                                                    return '#01406c'
                                                else
                                                    return 'white'
                                            },
                                            bgcolor: ()=>{
                                                if (activeStep < index)
                                                    return '#6B728021'
                                                else if (activeStep === index)
                                                    return '#01406c21'
                                                else
                                                    return '#01406c'
                                            }
                                        }}
                                        variant={activeStep <= index ? 'soft' : 'solid'}
                                    >
                                        {activeStep <= index ? index + 1: <Check/>}
                                    </StepIndicator>
                                }

                                sx={[
                                    activeStep > index && index !== 2 && {'&::after': {bgcolor: ''}}
                                ]}
                            >
                                <StepButton sx={{
                                    fontFamily: 'Roboto bold'
                                }}>
                                    {step}
                                </StepButton>
                            </Step>
                        ))
                    }
                </Stepper>
            </div>

            <div className={`w-full mt-4 flex justify-center`}>
                <div className={`p-3 w-full sm:w-[80%] md:w-[60%] xl:w-[50%] border border-gray-300`}>
                    {
                        activeStep === 0 &&
                        <div className={``}>
                            <FormControl className={``}>
                                <FormLabel className={`roboto`}>Name</FormLabel>
                                <Input error={errors.name} type="text" name="name" value={mission.name} onChange={handleFirstStepChange} placeholder="Ex: Landing page design" className={`roboto`}/>
                                {
                                    errors.name && <ErrorBox content={errors.name} />
                                }
                            </FormControl>
                            <FormControl className={`mt-4`}>
                                <FormLabel className={`roboto`}>Description</FormLabel>
                                <Textarea error={errors.description} minRows={7} name="description" value={mission.description} onChange={handleFirstStepChange} placeholder="Landing page ui design ..." className={``} />
                                {
                                    errors.description && <ErrorBox content={errors.description} />
                                }
                            </FormControl>
                            <FormControl className={`mt-4 w-[60%] sm:w-[55%] md:w-[50%] lg:w-[38%] xl:w-[35%]`}>
                                <FormLabel className={`roboto`}>Mission rate</FormLabel>
                                <RateField rate={rate} setRate={setRate} />
                                {
                                    errors.rate && <ErrorBox content={errors.rate} />
                                }
                            </FormControl>
                            <div className={`mt-4`}>
                                <FormLabel className={`roboto`}>Mission render</FormLabel>
                                <div className={`grid grid-cols-2 gap-3`}>
                                    <div className="col-span-2 md:col-span-1">
                                        <Select defaultValue={''} value={mission.render_mode} onChange={(e, value)=>{
                                            setMission((prev)=>(
                                                {...prev, render_mode: value}
                                            ))
                                        }} name="render_mode" className={`roboto`}>
                                            <Option value="" disabled>Select render type</Option>
                                            <Option value='onedrive'>Drive</Option>
                                            <Option value='github'>GitHub</Option>
                                        </Select>
                                        {
                                            errors.render_mode && <ErrorBox content={errors.render_mode} />
                                        }
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <Input error={errors.render_link} placeholder="Render link" value={mission.render_link} name="render_link" onChange={handleFirstStepChange} className={`roboto`} />
                                        {
                                            errors.render_link && <ErrorBox content={errors.render_link} />
                                        }
                                    </div>
                                </div>
                            </div>
                            <FormControl className={`mt-4`}>
                                <FormLabel className={`roboto`}>Start date</FormLabel>
                                <Input type="date" error={errors.start_date} className={`roboto`} value={mission.start_date} name="start_date" onChange={handleFirstStepChange} />
                                {
                                    errors.start_date && <ErrorBox content={errors.start_date} />
                                }
                            </FormControl>
                            <FormControl className={`mt-4`}>
                                <FormLabel className={`roboto`}>Due date</FormLabel>
                                <Input type="date" error={errors.deadline} className={`roboto`} value={mission.deadline} name="deadline" onChange={handleFirstStepChange} />
                                {
                                    errors.deadline && <ErrorBox content={errors.deadline} />
                                }
                            </FormControl>
                        </div>
                    }
                    {
                        activeStep === 1 &&
                        <div className={``}>
                            <ImageInput setImage={setPicture} ID='new-project-pic' className={` w-[60%] border border-gray-100`} />
                            {
                                errors.picture && <ErrorBox content={errors.picture} />
                            }
                        </div>
                    }
                    {
                        activeStep === 2 &&
                        <div className={``}>
                            <FormControl className={``}>
                                <FormLabel className={`roboto`}>Role name</FormLabel>
                                <Input error={errors.name} className="roboto" name="name" onChange={(e)=>setRole({...role, ['name']: e.target.value})} value={role.name} placeholder="Ex: Game developer" />
                                {
                                    errors.name && <ErrorBox content={errors.name} />
                                }
                            </FormControl>
                            <FormControl className={`mt-4`}>
                                <FormLabel className={`roboto`}>Skills</FormLabel>
                                <Autocomplete
                                    multiple
                                    placeholder="Select skills"
                                    options={skills}
                                    value={role.skills}
                                    onChange={(event, newSkills)=>{
                                        setRole({
                                            ...role,
                                            ['skills']: newSkills
                                        })
                                    }}
                                    className="roboto"
                                    error={errors.skills}
                                />
                                {
                                    errors.skills && 
                                    <div className="">
                                        <ErrorBox content={errors.skills} />
                                    </div>
                                }
                            </FormControl>
                        </div>
                    }
                    <div className={`flex mt-5 gap-4 items-center justify-end`}>
                        {
                            activeStep > 0 &&
                            <>
                                <Button onClick={()=>setActiveStep(activeStep - 1)} variant='outlined' sx={{
                                    textTransform: 'none'
                                }} className={`text-blue-main w-[100px] h-[38px] roboto-medium`}>
                                    Previous
                                </Button>
                            </>
                        }
                        {
                            activeStep < steps.length - 1 &&
                            <Button onClick={handleNextClick} sx={{
                                textTransform: 'none',
                            }} className={`bg-blue-main text-white! w-[100px] h-[38px] roboto-medium`}>
                                Next
                            </Button>
                        }
                        {
                            activeStep === steps.length - 1 &&
                                <Button sx={{
                                    textTransform: 'none',
                                }} onClick={handleFinalSubmit} className={`bg-blue-main w-[100px] h-[38px] roboto-medium text-white!`}>
                                    {
                                        loading ?
                                        <CircularProgress size={12} sx={{
                                            color: 'white'
                                        }} />:
                                        <>Create</>
                                    }
                                </Button>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

function NewMission() {

    useEffect(()=>{
        document.title = "New mission - STM";
        window.scrollTo({top: 0, behavior: 'smooth'})
    }, [])

    return (
        <div>
            <CompanyNavigation current="missions" showSide={false} />
            <Container className="mt-16 md:mt-20">
                <Content/>
            </Container>
        </div>
    )
}

export default NewMission;
