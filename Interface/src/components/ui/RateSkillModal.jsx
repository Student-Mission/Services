import { Modal, ModalClose, Sheet } from "@mui/joy";
import { Button, CircularProgress, Rating } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ErrorBox from "./ErrorBox";
import Connection from "../../services/Connection";
import { requestFailureHandler } from "../../lib/utils";


function RateSkillModal({show, onHide, currentSkill}) {

    const brief = "Your current rating for this skill is based on your profile and previous evaluations";
    // const rate = 5.5;
    
    const getPrecision = (_rate)=>{
        if (_rate === 0) return 0.00;
        return (_rate - parseInt(_rate)).toPrecision(2);
    }
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [requestError, setRequestError] = useState(null);

    const computeRate = ()=>{
        if (!currentSkill)
            return 0.0;
        return ((currentSkill.mission_rate * 0.7) + (currentSkill.test_rate * 0.3)).toPrecision(2);
    }

    const rate = currentSkill && currentSkill.test_rate ? currentSkill.test_rate: 0;
    
    const handleMakeTest = ()=>{
        if (loading)
            return;
        const form = {
            skill_name: currentSkill.name
        }
        Connection.post("student/profile/skills/make-test/", form, (data)=>{
            const testID = data.uuid;
            navigate(`/student/skills/${currentSkill.name}/${testID}`)
        }, (error)=>{
            console.log(error);
            requestFailureHandler(error, setRequestError, navigate, (data)=>{
                setRequestError({
                    fr: "Compétence invalide",
                    en: "Invalid skill"
                })
                
            })
        }, setLoading, true);
    }
    
    return (
        <Modal
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            onClose={onHide}
            open={show}
        >
            <Sheet
                variant="outlined"
                sx={{ width: {
                    xs: '300px',
                    sm: '450px',
                    lg: '500px'
                }, borderRadius: 'md', p: 3, boxShadow: 'lg' }}
            >
                <ModalClose variant='plain' />
                <h3 className={`roboto-medium text-[23px] text-blue-focus`}>{currentSkill?.name}</h3>
                <p className={`roboto mt-4 text-gray-main text-[16px]`}>{brief}</p>
                <div className={`mt-5`}>
                    <p className={`roboto`}>Current Level</p>
                    <Rating max={10} readOnly value={computeRate()} toPrecision={0.5}
                        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                    />
                    <p className={`font-normal mt- text-[19px] roboto-medium text-sky`}>{computeRate()}/10</p>
                </div>
                {
                    requestError && <ErrorBox content={requestError} />
                }
                <Button disabled={loading} onClick={()=>{
                    handleMakeTest()
                }} sx={{
                    textTransform: 'none'
                }} className={`mt-5! h-[38px] w-full bg-blue-main text-white! gap-3! roboto`}>
                    {
                        loading ?
                        <CircularProgress size={19} sx={{
                            color: 'white'
                        }} />:
                        <>
                            Start Test (MCQ)
                            <FaArrowRight className={``}/>
                        </>
                    }
                </Button>
            </Sheet>
        </Modal>
    )
}

export default RateSkillModal;
