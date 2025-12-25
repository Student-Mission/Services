import { Chip, Modal, ModalClose, Sheet } from "@mui/joy";
import { Avatar, Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import { FaCheck, FaStar } from "react-icons/fa6";
import {RxCross2} from "react-icons/rx";
import { useNavigate, useParams } from "react-router-dom";
import Connection from "../../services/Connection";
import ErrorBox from "../ui/ErrorBox";
import { requestFailureHandler } from "../../lib/utils";

const MEDIA_API = import.meta.env.VITE_MEDIA_API;

function ApplicantProfile({show, onHide, applicant, appId, onEditConfirm}) {

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
    const [validationLoading, setValidationLoading] = useState(false);
    const [declinationLoading, setDeclinationLoading] = useState(false);
    const [requestError, setRequestError] = useState(null);
    const {id} = useParams();

    const validateApplication = ()=>{
        if (validationLoading || declinationLoading)
            return;
        setRequestError(null);
        Connection.put(`company/missions/${id}/applications/${appId}/`, {status: 'confirmed'}, (data)=>{
            onEditConfirm(data)
            onHide();
        }, (error)=>{
            requestFailureHandler(error, setRequestError, navigate)
        }, setValidationLoading, true)
    }

    const declineApplication = ()=>{
        if (validationLoading || declinationLoading)
            return;
        setRequestError(null);
        Connection.put(`company/missions/${id}/applications/${appId}/`, {status: 'not-validated'}, (data)=>{
            onEditConfirm(data)
            onHide()
        }, (error)=>{
            requestFailureHandler(error, setRequestError, navigate)
        }, setDeclinationLoading, true)
    }

    return (
        <Modal open={show} onClose={onHide} sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Sheet sx={{
                maxWidth: {
                    xs: '300px',
                    sm: '450px',
                    lg: '500px',
                    xl: '650px'
                },
                borderRadius: 'md',
                boxShadow: 'lg'
            }}>
                <div className={`flex! h-[60px] border-b px-5 border-gray-200 justify-between items-center!`}>
                    <h3 className={`roboto  text-[18px] text-gray-900`}>Applicant Profile</h3>
                    <ModalClose variant="plain" className={`mb-0! mt-1!`}/>
                </div>
                <div className={`flex items-start mt-5 px-5 gap-5`}>
                    <Avatar src={MEDIA_API + applicant.user.picture} alt={applicant.user.username} className={`w-[90px]! h-[90px]! bg-blue-main`} />
                    <div className={``}>
                        <div className={`flex items-center gap-2`}>
                            <h5 className={`roboto-medium text-[20px] line-clamp-1 max-w-[80%]`}>{applicant.user.username}</h5>
                            <Chip sx={{textTransform: 'uppercase'}} className={` text-[9px]! ${levelsTheme[applicant.level]}`}>
                                {applicant.level}
                            </Chip>
                        </div>
                        <div className={`mt-1 flex gap-1`}>
                            <FaStar className={`text-[20px] text-yellow-300`}/>
                            <strong className={`font-normal roboto text-[17px]!`}>{applicant.global_rate}</strong>
                        </div>
                        <div className={``}>
                            <p className={`text-gray-500 roboto mt-3`}>{applicant.bio}</p>
                        </div>
                    </div>
                </div>
                <div className={`mt-7 px-5 flex flex-wrap gap-3 pb-5 border-b border-gray-200 max-h-[100px] overflow-h-scroll`}>
                    {
                        applicant.skills.map((skill, index)=>(
                            <Chip key={index} variant='outlined' className={`p-1 px-4 roboto rounded-md!`}>
                                {skill.name}
                            </Chip>
                        ))
                    }
                </div>
                {
                    requestError && <ErrorBox content={requestError} className="mt-3 text-[15px]!" />
                }
                {
                    applicant.status === 'pending' &&
                    <div className={`h-[60px] px-5 bg-gray-100 w-full flex flex-wrap md:items-center justify-end gap-3`}>
                        <Button onClick={declineApplication} disabled={validationLoading || declinationLoading} sx={{
                            textTransform: 'none'
                        }} variant='outlined' className={`w-[120px] text-[15px]! gap-2 h-[38px] roboto border-red-400! text-red-400! disabled:text-gray-500! disabled:border-gray-500!`}>
                            {
                                declinationLoading ?
                                <CircularProgress size={18} sx={{
                                    color: 'red'
                                }} />:
                                <>
                                    <RxCross2 className={``}/>
                                    Reject
                                </>
                            }
                        </Button>
                        <Button onClick={validateApplication} disabled={validationLoading || declinationLoading} sx={{
                            textTransform: 'none'
                        }} className={`w-[200px] h-[38px] text-[15px]! gap-2 bg-blue-main roboto text-white!`}>
                            {
                                validationLoading ?
                                <CircularProgress size={18} sx={{
                                    color: 'white'
                                }} />:
                                <>
                                    <FaCheck className={``}/>
                                    Accept Application
                                </>
                            }
                        </Button>
                    </div>
                }
            </Sheet>
        </Modal>
    )
}

export default ApplicantProfile;
