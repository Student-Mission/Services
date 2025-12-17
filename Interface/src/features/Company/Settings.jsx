import { useContext, useEffect, useState } from "react";
import CompanyNavigation from "../../components/layout/CompanyNavigation";
import Container from "../../components/layout/Container";
import { Chip, FormControl, FormLabel, Input, Option, Select, Textarea } from "@mui/joy";
import { Button, CircularProgress } from "@mui/material";
import FileCard from "../../components/ui/FileCard";
import { FaCircleCheck, FaClock } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import FileInput from "../../components/ui/FileInput";
import Connection from "../../services/Connection";
import { accountRules, kycRules, passwordRules, pictureRules } from "./rules/settings";
import ErrorBox from "../../components/ui/ErrorBox";
import Validator from "../../lib/validations/validator";
import ImageInput from "../../components/ui/ImageInput";
import { useNavigate } from "react-router-dom";
import { requestFailureHandler } from "../../lib/utils";
import { GlobalContext } from "../../contexts/Global";
import { GoDownload } from "react-icons/go";

const MEDIA_API = 'http://localhost:8000';

const KYCStatusCard = ({status})=>{

    const statusStyles = {
        'validated': 'border-sky bg-sky-50 text-sky',
        'waiting-for-validation': 'border-orange-400 bg-orange-50 text-orange-400',
        'not-validated': 'border-red-400 bg-red-50 text-red-400'
    }

    const labels = {
        'not-validated': 'Not validated',
        'waiting-for-validation': 'Validation in progress',
        'validated': 'Validated'
    }


    return (
        <div className={`p-3 text-[15px] flex border items-center gap-2 roboto h-[35px] rounded-full ${statusStyles[status]}`}>
            {
                status === 'validated' && <FaCircleCheck  className={`text-[17px]`}/>
            }
            {
                status === 'waiting-for-validation' && <FaClock className={`text-[17px]`}/>
            }
            {
                status === 'not-validated' && <MdCancel className={`text-[17px]`}/>
            }
            {labels[status]}
        </div>
    )
}

// Main component
const Header = ()=>{

    const brief = "Manage your account and preferences.";
    return (
        <div className={`mt-[50px] pb-4 border-b border-gray-200`}>
            <h1 className={`text-[29px] roboto-medium`}>Settings</h1>
            <p className={`mt-2 roboto text-[18px] text-gray-main`}>{brief}</p>
        </div>
    )
}

const Content = ({account, setAccount, kyc, setKyc})=>{

    const [currentLanguage, setCurrentLanguage] = useState('en');
    const navigate = useNavigate();
    const [showKYCForm, setShowKYCForm] = useState(false);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState(account);
    const [passwords, setPasswords] = useState({
        old_password: '',
        new_password: ''
    })
    const [passwordErrors, setPasswordErrors] = useState({});
    const [passwordUpdateError, setPasswordUpdateError] = useState(null);
    const [passwordUpdateLoading, setPasswordUpdateLoading] = useState(false);

    const [canChangePassword, setCanChangePassword] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateRequestError, setUpdateRequestError] = useState(null);
    const {setProfile} = useContext(GlobalContext);

    const [kycForm, setKycForm] = useState({
        title: '',
        document: null
    });
    const [kycUpdateLoading, setKycUpdateLoading] = useState(false);
    const [kycErrors, setKycErrors] = useState({});
    const [kycRequestError, setKycRequestError] = useState(null);
    const [kycDownloading, setKycDownloading] = useState(false);

    // Handlers
    useEffect(()=>{
        setForm(account);
    }, [account])

    const handleChange = (event)=>{
        setForm({
            ...form,
            [event.target.name]: event.target.value
        })
    }

    const handlePasswordsChange = (event)=>{
        setPasswords({
            ...passwords,
            [event.target.name]: event.target.value
        })
    }

    const handleUpdate = ()=>{
        setErrors({});
        setUpdateRequestError(null);
        const validationRules = form.picture != account.picture ?
        {...accountRules, ...pictureRules}: accountRules
        const errorsTMP = Validator.validate(form, validationRules);

        if (Object.keys(errorsTMP).length === 0) {
            const formData = new FormData();
            Object.keys(form).forEach((key)=>{
                if (form[key] != account[key]) {
                    formData.append(key, form[key])
                }
            })
            Connection.patch('company/profile/', formData, (data)=>{
                setAccount(form);
                setProfile((prev)=>(
                    {
                        ...prev,
                        ['username']: form.username,
                        ['email']: form.email
                    }
                ))
            }, (error)=>{
                requestFailureHandler(error, setUpdateRequestError, navigate, (data)=>{
                    if (data.detail && data.detail instanceof Array && data.detail.length > 0 && data.detail[0] === 'A company with this name already exists') {
                        setUpdateRequestError({
                            fr: "Une entreprise de ce nom existe déjà.",
                            en: "A company with this name already exists."
                        })
                    } else {
                        setUpdateRequestError({
                            fr: "Formulaire invalide",
                            en: "Invalid form"
                        })
                    }
                })
            }, setUpdateLoading, true);
        } else {
            setErrors(errorsTMP);
        }
    }

    const handlePasswordUpdate = ()=>{
        setPasswordErrors({});
        setPasswordUpdateError(null);
        const errorsTMP = Validator.validate(passwords, passwordRules);

        if (Object.keys(errorsTMP).length === 0) {
            if (passwords.old_password === passwords.new_password) {
                setPasswordUpdateError({
                    fr: "Les mots de passes doivent être différents",
                    en: "Passwords must not be the same"
                })
                return;
            }
            Connection.put('auth/change-password/', passwords, (data)=>{
                setPasswords({
                    old_password: '',
                    new_password: ''
                })
                setCanChangePassword(false);
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

    const handleKYCUpdate = ()=>{
        const errorsTMP = Validator.validate(kycForm, kycRules);
        setKycErrors({});
        setKycRequestError(null);
        const formData = new FormData();

        if (Object.keys(errorsTMP).length === 0) {
            formData.append('title', kycForm.title);
            formData.append('document', kycForm.document);
            if (kyc) {
                Connection.put('company/profile/kyc/', formData, (data)=>{
                    setKyc(data.kyc);
                    setKycForm({
                        title: '',
                        document: null
                    })
                    setShowKYCForm(false);
                }, (error)=>{
                    requestFailureHandler(error, setKycRequestError, navigate);
                }, setKycUpdateLoading, true)
            } else {
                Connection.post('company/profile/kyc/', formData, (data)=>{
                    setKyc(data.kyc);
                    setKycForm({
                        title: '',
                        document: null
                    })
                    setShowKYCForm(false);
                }, (error)=>{
                    requestFailureHandler(error, setKycRequestError, navigate);
                }, setKycUpdateLoading, true)
            }
        } else {
            setKycErrors(errorsTMP);
        }
    }

    const downloadFile = async (fileUrl, fileName) => {
        setKycDownloading(true);
        try {
            // 1. Récupérer les données du fichier
            const response = await fetch(fileUrl);
            const blob = await response.blob();

            // 2. Créer une URL temporaire pour le Blob
            const url = window.URL.createObjectURL(blob);

            // 3. Créer un lien invisible et cliquer dessus
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName || 'document_download');
            document.body.appendChild(link);
            link.click();

            // 4. Nettoyage
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Erreur lors du téléchargement :", error);
        } finally {
            setKycDownloading(false);
        }
    };

    return (
        <div className={`pt-10`}>
            
            <div className={`bg-white rounded-2xl shadow-2xs p-2 xl:p-4 pt-8! pb-8! border border-gray-100`}>
                <h4 className={`roboto-medium text-[22px]`}>Language</h4>
                <Select value={currentLanguage} className={`w-full roboto mt-3 md:w-[65%]`}>
                    <Option value={''} disabled >Select a language</Option>
                    <Option value={'en'} >English</Option>
                    <Option value={'fr'}>French</Option>
                </Select>
            </div>

            <div className={`mt-8 bg-white rounded-2xl shadow-2xs p-2 xl:p-4 pt-8! pb-8! border border-gray-100`}>
                <h4 className={`roboto-medium text-[22px]`}>Account & Company profile</h4>

                <div className={`mt-5`}>
                    <FormControl className={``}>
                        <FormLabel className={`text-[16px]! text-blue-focus roboto`}>Username</FormLabel>
                        <Input placeholder="Ex: John Doe" value={form.username} onChange={handleChange} name="username" className={`w-full xl:w-[65%] h-[45px] roboto`} />
                        {
                            errors.username && <ErrorBox content={errors.username} />
                        }
                    </FormControl>
                    <FormControl className={`mt-4`}>
                        <FormLabel className={`text-[16px]! text-blue-focus roboto`}>Email</FormLabel>
                        <Input type='email' placeholder="Ex: johndoe@fake.com" value={form.email} onChange={handleChange} name='email' className={`w-full xl:w-[65%] h-[45px] roboto`} />
                        {
                            errors.email && <ErrorBox content={errors.email} />
                        }
                    </FormControl>
                    <FormControl className="mt-4">
                        <FormLabel className="text-[16]! text-blue-focus roboto ">Photo</FormLabel>
                        <ImageInput ID={'company-pic'} setImage={(value)=>{
                            setForm({
                                ...form,
                                ['picture']: value
                            })
                        }} defaultLabel={MEDIA_API + form.picture} className="w-full xl:w-[300px] border border-gray-200 cursor-pointer!" />
                        {
                            errors.picture && <ErrorBox content={errors.picture} />
                        }
                    </FormControl>
                    <FormControl className={`mt-4`}>
                        <FormLabel className={`text-[16px]! text-blue-focus roboto`}>Company name</FormLabel>
                        <Input placeholder="Ex: John Doe" value={form.name} name="name" onChange={handleChange} className={`w-full xl:w-[65%] h-[45px] roboto`} />
                        {
                            errors.name && <ErrorBox content={errors.name} />
                        }
                    </FormControl>
                    <FormControl className={`mt-4`}>
                        <FormLabel className={`text-[16px]! text-blue-focus roboto`}>Description</FormLabel>
                        <Textarea minRows={8} value={form.description} name="description" onChange={handleChange} className="w-full xl:w-[65%]" />
                        {
                            errors.description && <ErrorBox content={errors.description} />
                        }
                    </FormControl>
                    {
                        updateRequestError && <ErrorBox content={updateRequestError} />
                    }

                    <div className="flex items-center gap-4 mt-4">
                        {
                            form !== account &&
                            <>
                                <Button sx={{
                                    textTransform: 'none'
                                }} variant='outlined' onClick={()=>{
                                    setForm(account);
                                }} disabled={updateLoading} className="w-[100px] h-[38px] border-gray-main text-gray-main roboto-medium">
                                    Cancel
                                </Button>
                                <Button onClick={handleUpdate} disabled={updateLoading} sx={{
                                    textTransform: 'none'
                                }} className="w-[100px] h-[38px] bg-blue-main text-white! roboto-medium ">
                                    {
                                        updateLoading ?
                                        <CircularProgress size={24} sx={{
                                            color: 'white'
                                        }} />:<>Update</>
                                    }
                                </Button>
                            </>
                        }
                    </div>
                </div>
            </div>

            <div className={`bg-white mt-8 rounded-2xl shadow-2xs p-2 xl:p-4 pt-8! pb-8! border border-gray-100`}>
                <h4 className={`roboto-medium text-[22px]`}>Account security</h4>
                <FormControl className={`mt-4`}>
                    <FormLabel className={`text-[16px]! text-blue-focus roboto`}>
                        {
                            canChangePassword && <>Old password</>
                        }
                    </FormLabel>
                    <div className="flex items-center gap-4">
                        <div className="w-full xl:w-[65%]">
                            <Input disabled={!canChangePassword} placeholder="* * * * * * * *" type="password" value={passwords.old_password} name="old_password" onChange={handlePasswordsChange} className={`w-full h-[45px]`} />
                            {
                                canChangePassword && passwordErrors.old_password && <ErrorBox content={passwordErrors.old_password} />
                            }
                        </div>
                        {
                            !canChangePassword &&
                                <Button onClick={()=>setCanChangePassword(true)} sx={{
                                    textTransform: 'none'
                                }} className="bg-blue-main text-[17px]! h-[45px] w-[100px] text-white!">
                                    Change
                                </Button>
                            }
                        </div>
                </FormControl>
                {
                    canChangePassword &&
                    <FormControl className={`mt-4`}>
                        <FormLabel className={`text-[16px]! text-blue-focus roboto`}>New password</FormLabel>
                        <Input placeholder="* * * * * * * * *" type="password" value={passwords.new_password} name="new_password" onChange={handlePasswordsChange} className={`w-full xl:w-[65%] h-[45px]`} />
                        {
                            passwordErrors.new_password && <ErrorBox content={passwordErrors.new_password} />
                        }
                    </FormControl>
                }
                {
                    canChangePassword &&
                    <>
                        {
                            passwordUpdateError && <ErrorBox content={passwordUpdateError} />
                        }
                        <div className={`mt-3 flex items-center justify-end gap-4 w-full xl:w-[65%] h-[45px]`}>
                            <Button onClick={()=>{
                                setPasswords({
                                    old_password: '',
                                    new_password: ''
                                })
                            }} disabled={passwordUpdateLoading} variant='outlined' sx={{
                                textTransform: 'none'
                            }} className={`border-sky text-sky roboto`}>
                                Cancel
                            </Button>
                            <Button onClick={handlePasswordUpdate} disabled={passwordUpdateLoading} sx={{
                                textTransform: 'none'
                            }} className={`w-[120px] h-[38px] bg-blue-main text-white! roboto`}>
                                {
                                    passwordUpdateLoading ?
                                    <CircularProgress size={21} sx={{
                                        color: "white"
                                    }} />:
                                    <>Change</>
                                }
                            </Button>
                        </div>
                    </>
                }
            </div>

            <div className={`bg-white mt-8 rounded-2xl shadow-2xs p-2 xl:p-4 pt-8! pb-8! border border-gray-100`}>
                <h4 className={`roboto-medium text-[22px]`}>Company Proof</h4>
                
                <div className={`mt-5`}>
                    
                    <FormControl className="mt-4">
                        <FormLabel className="text-[16px]! text-blue-focus roboto-medium ">KYC</FormLabel>
                        {
                            showKYCForm ?
                            <div className={`w-full xl:w-[65%] mt-5 mb-5`}>
                                <FormControl className={``}>
                                    <Input placeholder="Title" className={`roboto`} value={kycForm.title} onChange={(e)=>setKycForm({...kycForm, ['title']: e.target.value})} type='text' />
                                    {
                                        kycErrors.title && <ErrorBox content={kycErrors.title} />
                                    }
                                </FormControl>
                                <FormControl className={`mt-3`}>
                                    {
                                        kycForm.document &&
                                        <Chip className="mb-3" variant='outlined'>
                                            {
                                                kycForm.document.name
                                            }
                                        </Chip>
                                    }
                                    <FileInput placeholder="Select document" onChange={(value)=>{
                                        setKycForm({
                                            ...kycForm,
                                            ['document']: value
                                        })
                                    }} />
                                    {
                                        kycErrors.document && <ErrorBox content={kycErrors.document} />
                                    }
                                    
                                </FormControl>
                                {
                                    kycRequestError && <ErrorBox content={kycRequestError} />
                                }
                                <div className={`mt-3 flex items-center gap-3`}>
                                    <Button sx={{
                                        textTransform: 'none'
                                    }} disabled={kycUpdateLoading} onClick={()=>{
                                        setShowKYCForm(false)
                                        setKycForm({
                                            title: '', document: null
                                        })
                                        setKycErrors({})
                                        setKycRequestError(null);
                                    }} variant='outlined' className={`w-[100px] h-[38px] roboto-medium border-gray-main text-gray-main`}>
                                        Cancel
                                    </Button>
                                    <Button disabled={kycUpdateLoading} sx={{
                                        textTransform: 'none'
                                    }} onClick={handleKYCUpdate} className={`w-[100px] h-[38px] bg-blue-main text-white! roboto-medium`}>
                                        {
                                            kycUpdateLoading ?
                                            <CircularProgress size={19} sx={{
                                                color: 'white'
                                            }} />:
                                            <>Update</>
                                        }
                                    </Button>
                                </div>
                            </div>:
                            <>
                            {
                                kyc ?
                                <div className={`mb-3 p-4 h-[77px] flex items-center gap-4 border border-gray-300 rounded-2xl bg-gray-50`}>
                                    {
                                        kyc.status === 'validated' &&
                                        <FaCircleCheck className={`text-[20px] text-green-600`} />
                                    }
                                    {
                                        kyc.status === 'pending' &&
                                        <FaClock className={`text-amber-600 text-[20px]`}/>
                                    }
                                    <div className={``}>
                                        <strong className={`font-normal text-[17px] roboto text-blue-focus`}>{kyc.title}</strong>
                                        <p className={`roboto-light text-gray-500`}>Submitted on: {kyc.updated_at}</p>
                                    </div>
                                    <div className={`flex gap-4 flex-1 justify-end flex-wrap`}>
                                        <Button sx={{
                                            textTransform: 'none'
                                        }} onClick={()=>{
                                            setShowKYCForm(true);
                                        }} className="bg-blue-main text-white! roboto">
                                            Edit
                                        </Button>
                                        <Button disabled={kycDownloading} sx={{
                                            textTransform: 'none'
                                        }} onClick={()=>{
                                            downloadFile(MEDIA_API + kyc.document, kyc.title)
                                        }} className={`gap-2 text-gray-500! w-[120px] h-[38px] roboto bg-white! border! border-gray-200!`}>
                                            {
                                                kycDownloading ?
                                                <CircularProgress size={19} />:
                                                <>
                                                    <GoDownload className={`text-[17px]`}/>
                                                    Download
                                                </>
                                            }
                                        </Button>
                                    </div>
                                </div>:
                                <Button onClick={()=>setShowKYCForm(true)} sx={{
                                    textTransform: 'none'
                                }} className={`${showKYCForm && 'hidden!'} w-[100px] h-[38px] bg-blue-main text-white! roboto`}>
                                    Set KYC
                                </Button>
                                
                            }
                            </>
                        }
                    </FormControl>
                </div>
            </div>
        </div>
    )
}


function Settings() {

    // Variables
    const [loading, setLoading] = useState(true);
    const [mainError, setMainError] = useState(null);
    const [account, setAccount] = useState({
        name: "",
        description: "",
        username: "",
        email: "",
        picture: ""
    })
    const [kyc, setKyc] = useState(null);

    // Effects
    useEffect(()=>{
        document.title = "Settings - STM";
        fetchProfile();
    }, [])

    // Handles

    const profileSuccessHandler = (data)=>{
        // console.log(data);
        setAccount(data.profile);
        setKyc(data.profile.kyc);
    }

    const errorHandler = (error) =>{
        console.log(error);
        if (error.response) {
            setMainError({
                fr: "Erreur de récupération du profil",
                en: "Failed to fetch profile"
            })
        } else {

        }
    }

    function fetchProfile() {
        Connection.get('company/profile/', profileSuccessHandler, errorHandler, setLoading, true);
    }


    return (
        <div className={`bg-slate-50 min-h-screen`}>
            <CompanyNavigation current="settings" />
            <Container className={`pt-[90px]`}>
                {
                    loading &&
                    <div className={`w-full flex items-center justify-center h-[100px]`}>
                        <CircularProgress size={25} sx={{
                            color: '#01406c'
                        }} />
                    </div>
                }
                {
                    !mainError && !loading &&
                    <>
                        <Header />
                        <Content kyc={kyc} setKyc={setKyc} setAccount={setAccount} account={account} />
                    </>
                }
                {
                    mainError && !loading &&
                    <div className="h-[200px] w-full flex items-center justify-center">
                        <strong className="text-[21px] font-normal text-gray-400 roboto-medium">{mainError.fr}.</strong>
                    </div>
                }
            </Container>
        </div>
    )
}

export default Settings;
