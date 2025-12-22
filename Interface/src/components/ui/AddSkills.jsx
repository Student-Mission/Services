import { Autocomplete, FormControl, FormLabel, Modal, ModalClose, Sheet } from "@mui/joy";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../contexts/Global";
import { Button, CircularProgress } from "@mui/material";
import Connection from "../../services/Connection";
import { requestFailureHandler } from "../../lib/utils";
import { useNavigate } from "react-router-dom";
import ErrorBox from "./ErrorBox";

const rawSkillsToLabels = (_skills=[])=>{

    return (
        _skills.map((skill)=>(
            {
                ...skill,
            }
        ))
    )
}

const labelSkillsToRaw = (_skills=[])=>{
    return (
        _skills.map((skill)=>(
            skill.name
        ))
    )
}

const formatSkills = (_skills=[])=>{
    return (
        _skills.map((skill)=>(
            {name: skill}
        ))
    )
}

function AddSkills({show, onHide, onConfirm, currentSkills}) {

    const brief = "Add skills & abilities";
    const {skills} = useContext(GlobalContext);
    const [editedSkills, setEditedSkills] = useState(currentSkills);
    const [requestError, setRequestError] = useState(null);

    useEffect(()=>{
        setEditedSkills(currentSkills);
    }, [currentSkills])
    const handleChange = (e, values)=>{
        setEditedSkills(values);
    }
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = ()=>{
        setRequestError(null);
        if (loading)
            return;
        if (editedSkills?.length === 0 || editedSkills === currentSkills)
            return;
        Connection.put('student/profile/skills/', {skills: labelSkillsToRaw(editedSkills)}, (data)=>{
            onConfirm(data);
            onHide();
        }, (error)=>{
            console.log(error);
            requestFailureHandler(error, setRequestError, navigate);
        }, setLoading, true)
    }

    return (
        <Modal sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }} onClose={onHide} open={show} >
            <Sheet variant="outlined" sx={{
                width: {
                    xs: "300px",
                    sm: "450px",
                    lg: '500px'
                },
                borderRadius: 'md',
                p: 3,
                boxShadow: 'lg'
            }} >
                <ModalClose variant="plain" />
                <h3 className={`roboto-medium text-[23px] text-blue-focus`}>Add new skills</h3>
                <p className={`roboto mt-4 text-gray-main text-[16px]`}>{brief}</p>
                <FormControl className={`mt-5`}>
                    <FormLabel>Skills</FormLabel>
                    <Autocomplete
                        multiple
                        options={formatSkills(skills)}
                        value={rawSkillsToLabels(editedSkills)}
                        onChange={handleChange}
                        getOptionLabel={(option)=> option.name}
                    />
                </FormControl>
                {
                    requestError && <ErrorBox content={requestError} />
                }
                {
                    editedSkills?.length > 0 && editedSkills !== currentSkills &&
                    <div className={`mt-5 flex justify-end`}>
                        <Button onClick={handleSubmit} sx={{
                            textTransform: 'none'
                        }} className={`bg-blue-main text-white! roboto w-[100px] h-[38px]`}>
                            {
                                loading ?
                                <CircularProgress size={17} sx={{
                                    color: 'white'
                                }} />:
                                <>Update</>
                            }
                        </Button>
                    </div>
                }
            </Sheet>
        </Modal>
    )
}

export default AddSkills;