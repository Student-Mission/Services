import { Avatar, Button, CircularProgress, Container, Skeleton } from "@mui/material";
import StudentNavigation from "../../components/layout/StudentNavigation";
import { FaTrash, FaCircleCheck, FaClock } from "react-icons/fa6";
import { FaCrown } from "react-icons/fa";
import { Chip, FormControl, FormLabel, Input, Textarea } from "@mui/joy";
import { GoDownload, GoPlus, GoUpload } from "react-icons/go";
import { IoMdLock, IoMdCloudUpload } from "react-icons/io";
import RateSkillModal from "../../components/ui/RateSkillModal";
import { useEffect, useState } from "react";
import Connection from "../../services/Connection";
import { useNavigate } from "react-router-dom";
import { requestFailureHandler } from "../../lib/utils";
import ErrorBox from "../../components/ui/ErrorBox";
import { bioRules, passwordRules, personalDetailsRules, pictureRules, proofRules } from "./rules/profile";
import Validator from "../../lib/validations/validator";
import AddSkills from "../../components/ui/AddSkills";
import DocumentInput from "../../components/ui/DocumentInput";

const MEDIA_API = import.meta.env.VITE_MEDIA_API;

// const profile = {
//     personal: {
//         username: 'Abiola Shadow',
//         email: 'abiolashadow@fake.com',
//         bio: "Just a game developer",
//         picture: 'none'
//     },
//     details: {
//         skills: ['C++', 'C', 'C#', 'Python'],
//         level: 'Rookie',
//         global_rate: 8.2,
//         status: 'validated',
//         profile_completion: 75,
//         kycs: [
//             {
//                 title: 'Enrollment Certificate 2025-2026',
//                 created_at: '2025-12-05',
//                 status: 'pending',
//             },
//             {
//                 title: 'Enrollment Certificate 2022-2023',
//                 created_at: '2022-09-05',
//                 status: 'validated',
//             },
//             {
//                 title: 'Enrollment Certificate 2021-2022',
//                 created_at: '2021-09-19',
//                 status: 'validated',
//             }
//         ]
//     }
// }

// Annexes components




// Main components

function Content({loading, profile, setProfileData}) {

    const navigate = useNavigate();

    // Personal data management
    const [personal, setPersonal] = useState({
        username: '',
        email: '',
        bio: '',
        picture: ''
    });
    const [pictureURL, setPictureURL] = useState(personal.picture)
    const [personalFormErrors, setPersonalFormErrors] = useState({});
    const [personalLoading, setPersonalLoading] = useState(false);
    const [personalUpdateError, setPersonalUpdateError] = useState(null);
    useEffect(()=>{
        setPersonal(profile.personal);
        setPictureURL(profile.personal.picture);
        // console.log(profile);
    }, [profile])


    const handlePersonalDataChange = (event)=>{
        setPersonal({
            ...personal,
            [event.target.name]: event.target.value
        })
    }

    const handlePictureChange = (event)=>{
        const file = event.target.files?.[0];
        if (!file)
            return;
        if (pictureURL && pictureURL.startsWith('blob:')) {
            URL.revokeObjectURL(pictureURL);
        }
        const newURLPreview = URL.createObjectURL(file)
        setPersonal({
            ...personal,
            ['picture']: file
        })
        setPictureURL(newURLPreview);
    }

    const handlePersonalUpdate = ()=>{
        if (personalLoading)
            return;
        setPersonalFormErrors({});
        setPersonalUpdateError(null);
        let validations = {
            ...personalDetailsRules,
            // ...bioRules,
            // ...pictureRules
        }
        const formData = new FormData();

        if (pictureURL.startsWith('blob:'))
            validations.picture = pictureRules.picture
        if (personal.bio.length !== 0)
            validations.bio = bioRules.bio;
        const errorsTMP = Validator.validate(personal, validations);
        
        if (Object.keys(errorsTMP).length === 0) {
            let dataChanged = false;
            Object.keys(personal).map((key)=>{
                if (personal[key] !== profile.personal[key]) {
                    dataChanged = true;
                    formData.append(key, personal[key]);
                }
            })
            if (dataChanged === false)
                return;
            Connection.patch('student/profile/', formData, (data)=>{
                setProfileData(data.profile);
            }, (error)=>{
                requestFailureHandler(error, setPersonalUpdateError, navigate, (data)=>{
                    console.log(data);
                    if (data.email && data.email[0] === "Email already used") {
                        setPersonalUpdateError({
                            fr: "Un compte avec cette adresse email existe déjà.",
                            en: "This email is not available."
                        })
                    } else {
                        setPersonalUpdateError({
                            fr: "Formulaire invalide",
                            en: "Invalid form"
                        })
                    }
                })
            }, setPersonalLoading, true);
        } else {
            setPersonalFormErrors(errorsTMP);
        }
    }

    // Passwords management
    const [canChangePassword, togglePasswordChange] = useState(false);
    const [passwords, setPasswords] = useState({
        old_password: '',
        new_password: ''
    })
    const [passwordUpdateLoading, setPasswordUpdateLoading] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState({});
    const [passwordUpdateError, setPasswordUpdateError] = useState(null);

    const handlePasswordsChange = (event)=>{
        setPasswords({
            ...passwords,
            [event.target.name]: event.target.value
        })
    }

    const handlePasswordUpdate = ()=>{
        if (passwordUpdateLoading)
            return;
        setPasswordErrors({});
        setPasswordUpdateError(null);
        const errorsTMP = Validator.validate(passwords, passwordRules);

        if (Object.keys(errorsTMP).length === 0) {
            if (passwords.new_password === passwords.old_password) {
                setPasswordUpdateError({
                    fr: "Les mots de passes doivent être différents",
                    en: "Passwords must not be the same"
                })
                return;
            }
            Connection.put('auth/change-password/', passwords, (data)=>{
                togglePasswordChange(false);
            }, (error)=>{
                requestFailureHandler(error, setPasswordUpdateError, navigate, (data)=>{
                    if (data.detail && data.detail instanceof Array && data.detail.length > 0) {
                        const msg = data.detail[0]
                        if (msg === 'bad credentials') {
                            setPasswordErrors({
                                old_password: {
                                    fr: "Mot de passe incorrecte",
                                    en: "Bad password"
                                }
                            })
                        } else if (msg === 'passwords must not be the same') {
                            setPasswordUpdateError({
                                fr: "Les mots de passes doivent être différents",
                                en: "Passwords must not be the same"
                            })
                        }
                    }
                })
            }, setPasswordUpdateLoading, true);
        } else {
            setPasswordErrors(errorsTMP);
        }
    }

    // Skill management
    const [showSkillManager, setShowSkillManager] = useState(false);
    const [currentSkills, setCurrentSkills] = useState(profile.details.skills || []);
    const [focusedSkill, setFocusedSkill] = useState(null);
    const [showSkillDetails, setShowSkillDetails] = useState(false);

    const handleSkillsUpdate = (data)=>{
        setCurrentSkills(data.skills)
    }

    useEffect(()=>{
        if (profile?.details?.skills) {
            setCurrentSkills(profile.details.skills);
        }
    }, [profile])

    // Student proof management
    const [proofForm, setProofForm] = useState({
        title: '',
        document: null
    })
    const [proofFormErrors, setProofFormErrors] = useState({});
    const [proofUpdateError, setProofUpdateError] = useState(null);
    const [proofUpdateLoading, setProofUpdateLoading] = useState(false);

    const handleFileError = (error)=>{
        setProofFormErrors({
            ...proofFormErrors,
            ['document']: error ? error: undefined
        })
    }

    const handleFileChange = (file)=>{
        if (file)
            setProofForm({
                ...proofForm,
                ['document']: file
            })
    }

    const handleProofSubmit = ()=>{
        const proofFormData = new FormData();
        const errorsTMP = Validator.validate(proofForm, proofRules);
        setProofFormErrors({});
        setProofUpdateError(null);

        if (Object.keys(errorsTMP).length === 0) {
            proofFormData.append('title', proofForm.title);
            proofFormData.append('document', proofForm.document);
            Connection.post('student/profile/kyc/', proofFormData, (data)=>{
                setProfileData({
                    ...profile,
                    ['details']: {
                        ...profile.details,
                        ['kycs']: data.kycs,
                        ['can_add_proof']: false
                    }
                })
                setProofForm({title: '', document: null});
            }, (error)=>{
                requestFailureHandler(error, setProofUpdateError, navigate, (data)=>{
                    if (data.detail && data.detail.length > 0) {
                        const msg = data.detail[0];
                        if (msg === 'cannot add student proof') {
                            setProofUpdateError({
                                fr: "Impossible d'ajouter un justificatif pour le moment",
                                en: "Unable to add a receipt for the moment"
                            })
                        } else {
                            setProofUpdateError({
                                fr: "Formulaire invalide",
                                en: "Invalid form"
                            })
                        }
                    }
                })
            }, setProofUpdateLoading, true);
        } else {
            setProofFormErrors(errorsTMP);
        }
    }


    return (
        <div className={`w-full grid grid-cols-12 gap-5 pt-[130px] pb-10`}>
            <div className={`col-span-12 md:col-span-6 lg:col-span-4`}>
                <div className={`w-full bg-white shadow-2xs rounded-2xl p-4 py-6 border border-gray-200`}>
                    {
                        !loading ?
                        <div className={`flex items-center gap-3 px-6`}>
                            <Avatar src={MEDIA_API + profile.personal.picture} alt={profile.personal.username} className={`bg-blue-main roboto-medium w-[60px]! h-[60px]!`} />
                            <div className={``}>
                                <div className={`flex items-center gap-2`}>
                                    <h4 className={`roboto-medium text-[21px] text-blue-focus`}>{profile.personal.username}</h4>
                                    <Chip variant='outlined' className={`border-sky-dark text-sky-dark roboto`}>
                                        Free
                                    </Chip>
                                </div>
                                <p className={`roboto-light mt-1 text-gray-500`}>{profile.details.level} | {profile.details.global_rate} ⭐</p>
                            </div>
                        </div>:
                        <div className={`flex items-center gap-3 px-6`}>
                            <Skeleton variant='circular' width={40} height={40} className={`rounded-full!`} />
                            <div className={``}>
                                <Skeleton width={200} height={30} />
                                <Skeleton width={200} height={30} />
                            </div>
                        </div>
                    }
                    <div className={`mt-3 px-6`}>
                        <Button sx={{
                            // textTransform: 'none'
                        }} variant='outlined' className={`gap-2 w-full h-[38px]`}>
                            {
                                !loading ?
                                <>
                                    <FaCrown className={`text-xl`}/>
                                    Upgrade
                                </>:
                                <CircularProgress size={18} />
                            }
                        </Button>
                    </div>
                </div>
            </div>
            <div className={`col-span-12 md:col-span-6 lg:col-span-8`}>
                {
                    loading &&
                    <div className={`p-3 py-4 h-[200px] flex items-center justify-center bg-white shadow-2xs rounded-2xl border border-gray-200`}>
                        <CircularProgress size={29} />
                    </div>
                }
                {
                    !loading &&
                    <>
                    <div className={`p-3 py-4 bg-white shadow-2xs rounded-2xl border border-gray-200`}>
                        <div className={`flex justify-between items-center`}>
                            <h3 className={`text-[22px] roboto-medium`}>Profile Completion</h3>
                            <strong className={`font-normal roboto text-green`}>{profile.details.profile_completion}%</strong>
                        </div>
                        <div className={`mt-2 w-full h-[9px] rounded-full bg-gray-200`}>
                            <div style={{
                                width: `${profile.details.profile_completion}%`
                            }} className={`h-full rounded-full bg-green`}>
                            </div>
                        </div>
                        <p className={`text-gray-500 roboto-light mt-2`}>Complete your profile</p>
                    </div>
                    {/* Personal */}
                    <div className={`p-3 py-4 mt-5 bg-white shadow-2xs rounded-2xl border border-gray-200`}>
                        <div className={`flex items-center gap-3 pb-4 border-b border-gray-200`}>
                            <h4 className={`text-[19px] roboto-medium`}>Personal Information</h4>
                        </div>
                        <div className={`mt-4 p-3`}>
                            <div className={``}>
                                <h6 className={`roboto text-blue-focus`}>Profile picture</h6>
                                <div className={`flex mt-3 items-center gap-5`}>
                                    {
                                        personal.picture instanceof Blob ?
                                        <div style={{
                                            backgroundImage: `url(${pictureURL})`
                                        }} className={`w-[60px] h-[60px] rounded-full bg-no-repeat bg-center bg-cover`}>
                                        </div>:
                                        <Avatar src={MEDIA_API + personal.picture} alt={personal.username ? personal.username : 'U'} className={`bg-blue-main roboto w-[65px]! h-[65px]! `} />
                                    }

                                    <FormLabel>
                                        <input id="picture-input" onChange={handlePictureChange} type='file' className="hidden" />
                                        <label htmlFor="picture-input" className={`roboto gap-2 w-[100px] h-[38px] rounded-md cursor-pointer flex items-center justify-center text-white! bg-blue-600! `}>
                                            {/* <label htmlFor="picture-input"> */}
                                            <GoUpload className={`text-[15px]!`}/>
                                            Upload
                                            {/* </label> */}
                                        </label>
                                        {
                                            personalFormErrors.picture && <ErrorBox content={personalFormErrors.picture} />
                                        }
                                    </FormLabel>
                                    {
                                        profile.personal.picture !== 'none' &&
                                        <Button onClick={()=>{
                                            setPersonal({
                                                ...personal,
                                                ['picture']: profile.personal.picture,
                                                ['remove_picture']: true
                                            })
                                            if (pictureURL.startsWith('blob:')) {
                                                URL.revokeObjectURL(pictureURL);
                                            }
                                            setPictureURL('none');
                                        }} sx={{
                                            textTransform: 'none'
                                        }} variant='outlined' className={`gap-2 roboto border-gray-500! text-gray-500!`}>
                                            <FaTrash className={``}/>
                                            Remove
                                        </Button>
                                    }
                                </div>
                                <p className={`text-[12px] mt-1 text-gray-600 roboto-light`}>Recommended size: 400x400px. JPG, PNG or JPEG</p>
                            </div>

                            <div className={`mt-4 w-full`}>
                                <div className={`flex items-center gap-4`}>
                                    <FormControl className={`w-[50%]`}>
                                        <FormLabel className={`roboto`}>Username</FormLabel>
                                        <Input className={`roboto`} value={personal.username} name="username" onChange={handlePersonalDataChange} placeholder="Ex: John Doe" />
                                        {
                                            personalFormErrors.username && <ErrorBox content={personalFormErrors.username} />
                                        }
                                    </FormControl>
                                    <FormControl className={`w-[50%]`}>
                                        <FormLabel className={`roboto`}>Email</FormLabel>
                                        <Input type='email' value={personal.email} onChange={handlePersonalDataChange} name="email" placeholder="" className={`roboto`} />
                                        {
                                            personalFormErrors.email && <ErrorBox content={personalFormErrors.email} />
                                        }
                                    </FormControl>
                                </div>
                                <FormControl className={`mt-3 pb-5 border-b border-gray-200`}>
                                    <FormLabel className={`roboto`}>Bio</FormLabel>
                                    <Textarea minRows={7} placeholder="Define your bio" name="bio" onChange={handlePersonalDataChange} value={personal.bio} className={``} />
                                    {
                                        personalFormErrors.bio && <ErrorBox content={personalFormErrors.bio} />
                                    }
                                </FormControl>
                            </div>
                            <div className={`mt-5 pb-5 gap-3 border-b border-gray-300 flex items-end justify-between`}>
                                <div className={`w-full`}>
                                    <h6 className={`roboto text-[19px]`}>Security</h6>
                                    {
                                        !canChangePassword ?
                                        <p className={`mt-5 roboto-light text-gray-main`}>Manage your account security settings.</p>:
                                        <div className={`mt-5`}>
                                            <FormControl className={`w-full!`}>
                                                <FormLabel className={`text-[16px]! roboto`}>Old password</FormLabel>
                                                <Input type='password' name="old_password" onChange={handlePasswordsChange} value={passwords.old_password} className={`roboto w-full`} />
                                                {
                                                    passwordErrors.old_password && <ErrorBox content={passwordErrors.old_password} />
                                                }
                                            </FormControl>
                                            <FormControl className={`mt-4`}>
                                                <FormLabel className={`text-[16px]! roboto`}>New password</FormLabel>
                                                <Input type='password' name="new_password" onChange={handlePasswordsChange} value={passwords.new_password} className={`roboto`} />
                                                {
                                                    passwordErrors.new_password && <ErrorBox content={passwordErrors.new_password} />
                                                }
                                            </FormControl>
                                            {
                                                passwordUpdateError && <ErrorBox content={passwordUpdateError} />
                                            }
                                        </div>
                                    }
                                </div>
                                <div className={`flex items-center h-full justify-end`}>
                                    {
                                        canChangePassword ?
                                        <Button onClick={handlePasswordUpdate} disabled={passwordUpdateLoading} sx={{
                                            textTransform: 'none'
                                        }} variant='outlined' className={`gap-2 w-[180px] h-[38px] roboto border-gray-400! text-blue-focus`}>
                                            {
                                                passwordUpdateLoading ?
                                                <CircularProgress size={18} sx={{
                                                    color: 'black'
                                                }} />:
                                                <>
                                                    <IoMdLock className={`text-[18px]`}/>
                                                    Update Password
                                                </>
                                            }
                                        </Button>:
                                        <Button onClick={()=> togglePasswordChange(true)} sx={{
                                            textTransform: 'none'
                                        }} variant='outlined' className={`gap-2 roboto border-gray-400! text-blue-focus`}>
                                            <IoMdLock className={`text-[18px]`}/>
                                            Change Password
                                        </Button>
                                    }
                                </div>
                            </div>
                            {
                                personalUpdateError && <ErrorBox content={personalUpdateError} />
                            }
                            {
                                personal !== profile.personal &&
                                <div className={`mt-4 gap-4 flex items-center justify-end`}>
                                    <Button onClick={()=>{
                                        if (personalLoading) return
                                        setPersonal(profile.personal);
                                        if (pictureURL.startsWith('blob:')) {
                                            URL.revokeObjectURL(pictureURL);
                                            setPictureURL(profile.personal.picture)
                                        }
                                    }} disabled={personalLoading} sx={{
                                        textTransform: 'none'
                                    }} className={`bg-gray-200! text-black! h-[38px] roboto`}>
                                        Reset
                                    </Button>
                                    <Button onClick={handlePersonalUpdate} disabled={personalLoading} sx={{
                                        textTransform: 'none'
                                    }} className={`bg-blue-600! w-[120px] h-[38px] text-white! roboto`}>
                                        {
                                            personalLoading ?
                                            <CircularProgress size={21} sx={{
                                                color: 'white'
                                            }} />:
                                            <>
                                                Save changes
                                            </>
                                        }
                                    </Button>
                                </div>
                            }
                        </div>
                    </div>
                    
                    {/* Skills management */}
                    <div className={`p-3 py-4 mt-5 bg-white shadow-2xs rounded-2xl border border-gray-200`}>
                        <RateSkillModal currentSkill={focusedSkill} show={showSkillDetails} onHide={()=>setShowSkillDetails(false)} />
                        <div className={`flex items-center justify-between pb-4 border-b border-gray-200`}>
                            <AddSkills show={showSkillManager} onHide={()=>setShowSkillManager(false)} onConfirm={handleSkillsUpdate} currentSkills={currentSkills} />
                            <h4 className={`roboto-medium text-[19px] text-blue-focus`}>Skills & Competencies</h4>
                            <Button onClick={()=>setShowSkillManager(true)} sx={{
                                textTransform: 'none'
                            }} className={`gap-1 text-white! roboto bg-blue-600!`}>
                                <GoPlus className={`text-[20px]`}/>
                                Add Skills
                            </Button>
                        </div>
                        <div className={`mt-5`}>
                            <p className={`roboto-light text-gray-500 text-[18px]`}>Showcase your abilities for projects.</p>
                            <div className={`flex flex-wrap gap-5 mt-4`}>
                                {
                                    currentSkills.map((skill, index)=>(
                                        <Chip onClick={()=>{
                                            setFocusedSkill(skill)
                                            setShowSkillDetails(true)
                                        }} key={index} className={`text-blue-600! cursor-pointer! px-6! roboto bg-blue-600/20!`}>
                                            {skill.name}
                                        </Chip>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    
                    {/* Proof */}
                    <div className={`p-3 py-4 mt-5 bg-white shadow-2xs rounded-2xl border border-gray-200`}>
                        <div className={`p-3 border-b border-gray-300`}>
                            <h4 className={`roboto-medium text-blue-focus text-[19px]`}>Student Proof</h4>
                            <p className={`roboto-light text-gray-500 text-[15px]`}>Upload your proof of enrollment for the current academic year if not.</p>
                        </div>
                        {
                            profile.details.can_add_proof &&
                            <div className={`mt-5 pb-5 p-3 border-b border-gray-200`}>
                                <FormControl>
                                    <FormLabel className={`roboto text-[16px]! text-gray-600`}>Title</FormLabel>
                                    <Input onChange={(e)=>setProofForm({...proofForm, ['title']: e.target.value})} value={proofForm.title} placeholder="Ex: Enrollment doc" type='text' />
                                    {
                                        proofFormErrors.title && <ErrorBox content={proofFormErrors.title} />
                                    }
                                </FormControl>
                                <DocumentInput maxSizeBytes={3*1024*1024} handleError={handleFileError} onChange={handleFileChange}/>
                                {
                                    proofForm.document &&
                                    <Chip variant='outlined' className="mt-3 max-w-full" >
                                        {proofForm.document.name}
                                    </Chip>
                                }
                                {
                                    proofFormErrors.document && <ErrorBox content={proofFormErrors.document} />
                                }
                                {
                                    proofUpdateError && <ErrorBox className="mt-3" content={proofUpdateError} />
                                }
                                <div className={`mt-3 flex justify-end`}>
                                    <Button onClick={handleProofSubmit} disabled={proofUpdateLoading} sx={{
                                        textTransform: 'none'
                                    }} className={`bg-blue-600! roboto w-[120px] h-[38px] text-white!`}>
                                        {
                                            proofUpdateLoading ?
                                            <CircularProgress size={18} sx={{
                                                color: 'white'
                                            }} />:
                                            <>
                                                Submit Proof
                                            </>
                                        }
                                    </Button>
                                </div>
                            </div>
                        }
                        {
                            profile.details.kycs.length > 0 &&
                            <div className={`mt-4 p-3`}>
                                <h5 className={`text-[18px] roboto-medium text-blue-focus`}>Submission History</h5>
                                <div className={`mt-3`}>
                                    {
                                        profile.details.kycs.map((history, index)=>(
                                            <div key={index} className={`mb-3 p-4 h-[77px] flex items-center gap-4 border border-gray-300 rounded-2xl bg-gray-50`}>
                                                {
                                                    history.status === 'validated' &&
                                                    <FaCircleCheck className={`text-[20px] text-green-600`} />
                                                }
                                                {
                                                    history.status === 'in_progress' &&
                                                    <FaClock className={`text-amber-600 text-[20px]`}/>
                                                }
                                                <div className={``}>
                                                    <strong className={`font-normal text-[17px] roboto text-blue-focus`}>{history.title}</strong>
                                                    <p className={`roboto-light text-gray-500`}>Submitted on: {history.submitted_at}</p>
                                                </div>
                                                <div className={`flex flex-1 justify-end`}>
                                                    <Button sx={{
                                                        textTransform: 'none'
                                                    }} className={`gap-2 text-gray-500! roboto bg-white! border! border-gray-200!`}>
                                                        <GoDownload className={`text-[17px]`}/>
                                                        Download
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        }
                    </div>
                    </>
                }
            </div>
        </div>
    )
}

function Profile() {

    const [loading, setLoading] = useState(true);
    const [profile, setProfileData] = useState({
        personal: {}, details: {}
    });
    const [requestError, setRequestError] = useState(null);
    const navigate = useNavigate();

    const fetchData = ()=>{
        Connection.get('student/profile/', (data)=>{
            setProfileData(data.profile);
        }, (error)=>{
            requestFailureHandler(error, setRequestError, navigate);
        }, setLoading, true);
    }

    useEffect(()=>{
        document.title = "Student Profile | STM";
        fetchData();
    }, [])


    return (
        <div className={`min-h-screen bg-gray-100`}>
            {/* {
                !loading &&
                
            } */}
            <StudentNavigation/>
            <Container>
                {
                    !requestError ?
                    <Content profile={profile} setProfileData={setProfileData} loading={loading} />:
                    <div className="h-[300px] flex items-center justify-center">
                        <strong className="text-[23px] font-normal roboto-medium text-gray-500">{requestError.en}</strong>
                    </div>
                }
            </Container>
        </div>
    )
}

export default Profile;
