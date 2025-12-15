import { useEffect, useState } from "react";
import CompanyNavigation from "../../components/layout/CompanyNavigation";
import Container from "../../components/layout/Container";
import { FormControl, FormLabel, Input, Option, Select, Textarea } from "@mui/joy";
import { Button, CircularProgress } from "@mui/material";
import FileCard from "../../components/ui/FileCard";
import { FaCircleCheck, FaClock } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import FileInput from "../../components/ui/FileInput";
import Connection from "../../services/Connection";
import { accountRules, companyRules } from "./rules/settings";
import ErrorBox from "../../components/ui/ErrorBox";
import Validator from "../../lib/validations/validator";
import ImageInput from "../../components/ui/ImageInput";
import { useNavigate } from "react-router-dom";

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

const Content = ({profile, setProfile})=>{

    const [currentLanguage, setCurrentLanguage] = useState('en');
    const navigate = useNavigate();
    const [showKYCForm, setShowKYCForm] = useState(false);
    const [account, setAccount] = useState(profile.account);
    const [company, setCompany] = useState(profile.company);
    const [canChangePassword, enablePasswordChange] = useState(false)
    const [showAccountUpdateButton, setShowAccountUpdateButton] = useState(false);
    const [showCompanyUpdateButton, setShowCompanyUpdateButton] = useState(false);
    const [accountErrors, setAccountErrors] = useState({});
    const [accountUpdateLoading, setAccountUpdateLoading] = useState(false);
    const [accountRequestError, setAccountRequestError] = useState(null);

    const [companyErrors, setCompanyErrors] = useState({});
    const [companyUpdateLoading, setCompanyUpdateLoading] = useState(false);
    const [companyRequestError, setCompanyRequestError] = useState(null);

    // Handlers
    const handleAccountChange = (event)=>{
        const accountTMP = {
            ...account,
            [event.target.name]: event.target.value
        }

        setAccount(accountTMP);
        setShowAccountUpdateButton(accountTMP !== profile.account);
        console.log('Accounts ', accountTMP !== profile.account);
        console.log(`Edited ${JSON.stringify(accountTMP)}`);
        console.log(`Origin ${JSON.stringify(profile.account)}`);
    }

    const handleAccountSubmit = ()=>{
        setAccountErrors({});
        setAccountRequestError(null);
        const errors = Validator.validate(account, {
            ...accountRules,
            ['password']: canChangePassword ? accountRules.password : {}
        });
        if (Object.keys(errors).length === 0) {
            const data = {
                ...account,
                ['password']: account.password.length === 0 ? undefined: account.password
            }
            Connection.patch('business/profile/', {account: data}, (data)=>{
                enablePasswordChange(false);
                setShowAccountUpdateButton(false);
                const accountTMP = {
                    ...account,
                    ['password']: ''
                }
                setAccount(accountTMP);
                setProfile({
                    ...profile,
                    ['account']: accountTMP
                })
            }, (error)=>{
                if (error.response) {
                    const status =  error.response.status;
                    if (status === 401) {
                        navigate("/login");
                    }
                    if (status === 400 && error.response.data.msg === 'email already used') {
                        setAccountRequestError({
                            fr: "L'email entré est déjà utilisé",
                            en: "Email already used"
                        })
                    } else {
                        setAccountRequestError({
                            fr: "Formulaire invalide",
                            en: "Invalid form"
                        })
                    }
                } else {
                    setAccountRequestError({
                        fr: "Erreur inattendue",
                        en: "Unexpected error"
                    })
                }
            }, setAccountUpdateLoading, true);
        } else {
            setAccountErrors(errors);
        }
    }

    const handleCompanyChange = (event)=>{
        const companyTMP = {
            ...company,
            [event.target.name]: event.target.value
        }

        setCompany(companyTMP);
        setShowCompanyUpdateButton(companyTMP !== profile.company);
    }

    const handleReset = (setValue, initial)=>{
        setValue(initial);
    }

    const companySubmitFailureHandler = (error)=>{
        setCompanyUpdateLoading(false);
        if (error.response) {
            const status = error.response.status;
            if (status === 401) {
                navigate('/login');
            } else if (status === 400) {
                setCompanyRequestError({
                    fr: "Formulaire invalide",
                    en: "Invalid form"
                })
            } else if (status >= 500) {
                setCompanyRequestError({
                    fr: "Erreur serveur, veuillez réessayer",
                    en: "Server error, try again"
                })
            }
        } else {
            setCompanyRequestError({
                fr: "Erreur inattendue",
                en: "Unexpected error"
            })
        }
    }

    const handleCompanySubmit = ()=>{
        setCompanyErrors({});
        setCompanyRequestError(null);
        setCompanyUpdateLoading(true);
        const errors = Validator.validate(company, companyRules);
        const form = new FormData();

        if (Object.keys(errors).length === 0) {
            const companyForm = {
                name: company.name,
                brief: company.brief
            }
            if (company.picture instanceof Blob) {
                form.append('picture', company.picture);
                Connection.post('user/profile/', form, ()=>{
                    Connection.patch('business/profile/', companyForm, (data)=>{
                        setShowCompanyUpdateButton(false);
                        setProfile({
                            ...profile,
                            ['company']: company
                        })
                }, companySubmitFailureHandler, setCompanyUpdateLoading, true);
                }, companySubmitFailureHandler, null, true);
            } else {
                Connection.patch('business/profile/', companyForm, (data)=>{
                    setShowCompanyUpdateButton(false);
                    setProfile({
                        ...profile,
                        ['company']: company
                    })
                }, companySubmitFailureHandler, setCompanyUpdateLoading, true);
            }
        } else {
            setCompanyErrors(errors);
        }

    }

    // Effects
    useEffect(()=>{
        if (company.picture instanceof Blob) {
            setShowCompanyUpdateButton(true);
        }
    }, [company.picture])
    

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
                <h4 className={`roboto-medium text-[22px]`}>Profile</h4>

                <div className={`mt-5`}>
                    <FormControl className={``}>
                        <FormLabel className={`text-[16px]! text-blue-focus roboto`}>Username</FormLabel>
                        <Input placeholder="Ex: John Doe" value={account.username} onChange={handleAccountChange} name="username" className={`w-full xl:w-[65%] h-[45px] roboto`} />
                        {
                            accountErrors.username && <ErrorBox content={accountErrors.username} />
                        }
                    </FormControl>
                    <FormControl className={`mt-4`}>
                        <FormLabel className={`text-[16px]! text-blue-focus roboto`}>Email</FormLabel>
                        <Input type='email' placeholder="Ex: johndoe@fake.com" value={account.email} onChange={handleAccountChange} name='email' className={`w-full xl:w-[65%] h-[45px] roboto`} />
                        {
                            accountErrors.email && <ErrorBox content={accountErrors.email} />
                        }
                    </FormControl>
                    <FormControl className={`mt-4`}>
                        <FormLabel className={`text-[16px]! text-blue-focus roboto`}>Password</FormLabel>
                        <div className="flex items-center gap-4">
                            <Input disabled={!canChangePassword} placeholder="* * * * * * * *" type="password" value={account.password} name="password" onChange={handleAccountChange} className={`w-full xl:w-[65%] h-[45px]`} />
                            {
                                !canChangePassword &&
                                <Button onClick={()=>enablePasswordChange(true)} sx={{
                                    textTransform: 'none'
                                }} className="bg-blue-main text-[17px]! h-[45px] w-[100px] text-white!">
                                    Change
                                </Button>
                            }
                        </div>
                        {
                            accountErrors.password && <ErrorBox content={accountErrors.password} />
                        }
                    </FormControl>
                    {
                        accountRequestError && <ErrorBox content={accountRequestError} className="mt-2" />
                    }

                    <div className="flex items-center gap-4 mt-4">
                        {
                            showAccountUpdateButton &&
                            <>
                                <Button sx={{
                                    textTransform: 'none'
                                }} variant='outlined' onClick={()=>{
                                    handleReset(setAccount, profile.account);
                                }} disabled={accountUpdateLoading} className="w-[100px] h-[38px] border-gray-main text-gray-main roboto-medium">
                                    Cancel
                                </Button>
                                <Button onClick={handleAccountSubmit} disabled={accountUpdateLoading} sx={{
                                    textTransform: 'none'
                                }} className="w-[100px] h-[38px] bg-blue-main text-white! roboto-medium ">
                                    {
                                        accountUpdateLoading ?
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
                <h4 className={`roboto-medium text-[22px]`}>Company</h4>
                
                <div className={`mt-5`}>
                    <FormControl>
                        <FormLabel className="text-[16]! text-blue-focus roboto ">Photo</FormLabel>
                        <ImageInput ID={'company-pic'} setImage={(value)=>{
                            setCompany({
                                ...company,
                                ['picture']: value
                            })
                        }} defaultLabel={MEDIA_API + company.picture} className="w-full xl:w-[300px] border border-gray-200 cursor-pointer!" />
                    </FormControl>
                    <FormControl className={`mt-4`}>
                        <FormLabel className={`text-[16px]! text-blue-focus roboto`}>Name</FormLabel>
                        <Input placeholder="Ex: John Doe" value={company.name} name="name" onChange={handleCompanyChange} className={`w-full xl:w-[65%] h-[45px] roboto`} />
                        {
                            companyErrors.name && <ErrorBox content={companyErrors.name} />
                        }
                    </FormControl>
                    <FormControl className={`mt-4`}>
                        <FormLabel className={`text-[16px]! text-blue-focus roboto`}>Description</FormLabel>
                        <Textarea minRows={8} value={company.brief} name="brief" onChange={handleCompanyChange} className="w-full xl:w-[65%]" />
                        {
                            companyErrors.brief && <ErrorBox content={companyErrors.brief} />
                        }
                    </FormControl>
                    {
                        companyRequestError && <ErrorBox content={companyRequestError} />
                    }
                    {
                        showCompanyUpdateButton &&
                        <div className="mt-4 flex items-center gap-3">
                            <Button sx={{
                                    textTransform: 'none'
                                }} variant='outlined' onClick={()=>{
                                    handleReset(setCompany, profile.company);
                                }} disabled={companyUpdateLoading} className="w-[100px] h-[38px] border-gray-main text-gray-main roboto-medium">
                                    Cancel
                                </Button>
                                <Button onClick={handleCompanySubmit} disabled={companyUpdateLoading} sx={{
                                    textTransform: 'none'
                                }} className="w-[100px] h-[38px] bg-blue-main text-white! roboto-medium ">
                                    {
                                        companyUpdateLoading ?
                                        <CircularProgress size={24} sx={{
                                            color: 'white'
                                        }} />:<>Update</>
                                    }
                                </Button>
                        </div>
                    }
                    <FormControl className="mt-4">
                        <FormLabel className="text-[16px]! text-blue-focus roboto-medium ">KYC</FormLabel>
                        {
                            showKYCForm ?
                            <div className={`w-full xl:w-[65%] mt-5 mb-5`}>
                                <FormControl className={``}>
                                    <Input placeholder="Title" className={`roboto`} type='text' />
                                </FormControl>
                                <FormControl className={`mt-3`}>
                                    <FileInput placeholder="Select document" />
                                </FormControl>
                                <div className={`mt-3 flex items-center gap-3`}>
                                    <Button sx={{
                                        textTransform: 'none'
                                    }} onClick={()=>setShowKYCForm(false)} variant='outlined' className={`w-[100px] h-[38px] roboto-medium border-gray-main text-gray-main`}>
                                        Cancel
                                    </Button>
                                    <Button sx={{
                                        textTransform: 'none'
                                    }} className={`w-[100px] h-[38px] bg-blue-main text-white! roboto-medium`}>
                                        Update
                                    </Button>
                                </div>
                            </div>:
                            <>
                            {
                                profile.kyc ?
                                <div className={``}>
                                    <div className={`flex items-center gap-3`}>
                                        <FileCard file={{
                                            name: profile.kyc.title + '.pdf',
                                            url: profile.kyc.document
                                        }} />
                                        <KYCStatusCard status={profile.kyc.status} />
                                    </div>
                                    {
                                        profile.kyc.status !== 'waiting-for-validation' &&
                                        <Button onClick={()=>setShowKYCForm(true)} variant='outlined' sx={{
                                            textTransform: 'none'
                                        }} className={`mt-4! w-[180px] h-[38px] border-blue-main text-blue-main roboto-medium`}>
                                            Request for change
                                        </Button>
                                    }
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
    const [profile, setProfile] = useState({
        account: {
            username: "Contact",
            email: "contact@ubisoft.com",
            password: ''
        },
        company: {
            name: "Ubisoft",
            brief: "Video game company",
        }
    })

    // Effects
    useEffect(()=>{
        document.title = "Settings - STM";
        fetchProfile();
    }, [])

    // Handles

    const profileSuccessHandler = (data)=>{
        // console.log(data);
        setProfile(data);
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
        Connection.get('business/profile/', profileSuccessHandler, errorHandler, setLoading, true);
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
                        <Content setProfile={setProfile} profile={profile} />
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
