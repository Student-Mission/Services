import { useContext, useEffect, useState } from "react";
import CompanyNavigation from "../../components/layout/CompanyNavigation";
import Container from "../../components/layout/Container";
import { FormControl, FormLabel, Input, MenuItem, Select, Step, StepButton, StepIndicator, Stepper, Textarea, Autocomplete, Option } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { Button, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { missionRules, rateRules, roleRules } from "./rules/new_mission";
import Validator from '../../lib/validations/validator';
import ErrorBox from "../../components/ui/ErrorBox"
import Connection from "../../services/Connection";
import { GlobalContext } from "../../contexts/Global";
import { FaCircleExclamation } from "react-icons/fa6";
import { requestFailureHandler } from "../../lib/utils";

const rawSkillsToLabels = (_skills=[])=>{
    return _skills.map((skill)=>(
        {label: skill}
    ))
}

const labelSkillsToRaw = (labeledSkills=[])=>{

    return labeledSkills.map((skill)=>(
        skill.label
    ))
}

function Content() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);


    const [mission, setMission] = useState({
        name: "",
        description: "",
        start_date: "",
        deadline: "",
        render_link: "",
        skills: [],
        level: ""
    })
    const [errors, setErrors] = useState({});
    const [mainError, setMainError] = useState({});


    const handleChange = (event)=>{
        setMission({
            ...mission,
            [event.target.name]: event.target.value
        })
    }

    const {setProfile, setLogged, skills} = useContext(GlobalContext);
    const brief = "Fill in the details below to post a new mission for students";

    // Submits
    const handleSubmit = ()=>{
        
        if (loading === true)
            return;
        setErrors({});
        setMainError(null);
        let validations = missionRules;
        validations.skills.choices.value = [...skills];
        // alert('submit')
        const errorsTMP = Validator.validate(mission, validations);

        if (Object.keys(errorsTMP).length === 0) {
            // alert('clean')
            Connection.post('company/create-mission/', mission, (data)=>{
                navigate('/company/missions');
            }, (error)=>{
                requestFailureHandler(error, setMainError, navigate);
            }, setLoading, true);
        } else {
            // alert('Error');
            setErrors(errorsTMP);
        }
    }

    return (
        <div className={`py-24 w-full lg:w-[80%] xl:w-[65%] 2xl:w-[55%]`}>
            <div className={``}>
                <h1 className={`text-[27px] roboto-semibold`}>Publish a New Project</h1>
                <p className={`text-[17px] text-gray-500 roboto-light mt-1`}>{brief}</p>
            </div>

            <div className={`w-full mt-10 shadow-sm bg-white rounded-xl px-7 py-5`}>
                <h3 className={`text-[18px] roboto-medium`}>Mission details</h3>
                
                <FormControl className={`mt-5`}>
                    <FormLabel className={`text-[16px]! roboto`}>Name</FormLabel>
                    <Input placeholder="e.g. Develop a new marketing website" name="name" value={mission.name} onChange={handleChange} className={`roboto`}/>
                    {
                        errors.name && <ErrorBox content={errors.name} />
                    }
                </FormControl>
                <FormControl className={`mt-5`}>
                    <FormLabel className={`text-[16px]! roboto`}>Description</FormLabel>
                    <Textarea minRows={7} className={`roboto`} name="description" value={mission.description} onChange={handleChange} placeholder="Provide detailed description of the project, including role, responsibilities, and expected outcomes." />
                    {
                        errors.description && <ErrorBox content={errors.description} />
                    }
                </FormControl>
                <FormControl className={`mt-5 w-full!`}>
                    <div className={`flex items-center!`}>
                        <FormLabel className={`roboto mt-1! text-[16px]!`}>Render link</FormLabel>
                        <Tooltip className={``} title="Provide a link where selected student can submit work." >
                            <IconButton>
                                <FaCircleExclamation className={`text-[13px]`}/>
                            </IconButton>
                        </Tooltip>
                    </div>
                    <Input type='url' className={`roboto w-full`} name="render_link" value={mission.render_link} onChange={handleChange}  placeholder="e.g. http://link.com"/>
                    {
                        errors.render_link && <ErrorBox content={errors.render_link} />
                    }
                </FormControl>
            </div>

            <div className={`w-full mt-10 shadow-sm bg-white rounded-xl px-7 py-5`}>
                <h3 className={`text-[18px]! roboto-medium`}>Requirements</h3>
                
                <FormControl className={`mt-5!`}>
                    <FormLabel className={`text-[16px]! roboto`}>Required Skills</FormLabel>
                    <Autocomplete
                        multiple
                        onChange={(e, values)=>{
                            setMission({
                                ...mission,
                                ['skills']: labelSkillsToRaw(values)
                            })
                        }}
                        options={rawSkillsToLabels(skills)}
                    />
                    {
                        errors.skills && <ErrorBox content={errors.skills} />
                    }
                </FormControl>
                <FormControl className={`mt-5`}>
                    <FormLabel className={`text-[16px]! roboto`}>Level</FormLabel>
                    <Select name="level" value={mission.level} onChange={(e, value)=>{
                        setMission({
                            ...mission,
                            ['level']: value
                        })
                    }} >
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
                </FormControl>
                <div className={`flex  mt-5 items-center gap-2`}>
                    <FormControl className={`w-[50%]`}>
                        <FormLabel className={`text-[16px]! roboto`}>Start date</FormLabel>
                        <Input type='date' name="start_date" value={mission.start_date} onChange={handleChange} className={`roboto`} />
                        {
                            errors.start_date && <ErrorBox content={errors.start_date}/>
                        }
                    </FormControl>
                    <FormControl className={`w-[50%]`}>
                        <FormLabel className={`text-[16px]! roboto`}>Deadline</FormLabel>
                        <Input type='date' name="deadline" value={mission.deadline} onChange={handleChange} className={`roboto`} />
                        {
                            errors.deadline && <ErrorBox content={errors.deadline} />
                        }
                    </FormControl>
                </div>
            </div>
            {
                mainError && <ErrorBox content={mainError} />
            }
            <div className={`mt-10 w-full flex items-center justify-end`}>
                <Button onClick={handleSubmit} disabled={loading} sx={{
                    textTransform: 'none'
                }} className={`bg-blue-main roboto text-white! w-[180px] h-[38px]`}>
                    {
                        loading ?
                        <CircularProgress size={19} sx={{
                            color: 'white'
                        }} />:
                        <>Post Project</>
                    }
                </Button>
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
        <div className={`bg-gray-50 min-h-screen`}>
            <CompanyNavigation current="missions" showSide={false} />
            <Container className="pt-16 md:pt-20">
                <div className={`w-full flex justify-center`}>
                    <Content/>
                </div>
            </Container>
        </div>
    )
}

export default NewMission;
