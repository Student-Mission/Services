import { useEffect, useState } from "react";
import { Button, CircularProgress, Container, FormControl, FormLabel, IconButton } from "@mui/material"
import logo from "../../assets/images/stm.png";
import { Input, Textarea } from "@mui/joy";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { GoDot } from "react-icons/go";
import { FaCheckCircle } from "react-icons/fa";
import { PiStudentLight } from "react-icons/pi";
import { IoBusinessOutline } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { registerRules, companyValidationRules } from "./rules/register";
import ImageInput from "../../components/ui/ImageInput";
import ErrorBox from "../../components/ui/ErrorBox";
import Validator from "../../lib/validations/validator";
import Connection from "../../services/Connection";
import { requestFailureHandler } from "../../lib/utils";

function Register() {

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [requestError, setRequestError] = useState(null);
    const navigate = useNavigate();

    const togglePasswordVisibility = ()=>{
        setShowPassword(!showPassword);
    }

    const [step, setStep] = useState('initial'); // initial or user_type
    const [form, setForm] = useState({
        email: "",
        username: "",
        password: "",
        confirm_password: "",
        type: 'student'
    })

    const [companyForm, setCompanyForm] = useState({
        name: '',
        description: "",
        picture: null
    })

    const onCompanyFormReset = ()=>{
        setCompanyForm({
            name: "",
            description: "",
            picture: null
        })
    }

    const userTypeOptions = [
        {
            value: 'student',
            label: 'Student',
            icon: PiStudentLight
        },
        {
            value: 'company',
            label: 'Company',
            icon: IoBusinessOutline
        }
    ]

    // Handlers

    const handleChange = (event, setData)=>{
        setData((prev)=>(
            {
                ...prev,
                [event.target.name]: event.target.value
            }
        ))
    }

    const onFirstStepSubmit = ()=>{
        setErrors({});
        setRequestError(null);
        const errorsTMP = Validator.validate(form, registerRules);
        if (Object.keys(errorsTMP).length === 0) {
            setStep('user_type');
        } else {
            setErrors(errorsTMP);
        }
    }


    const onSubmitFailure = (error)=>{
        requestFailureHandler(error, setRequestError, navigate, (data)=>{
            if (data.email && data.email instanceof Array && data.email.length > 0 && data.email[0] === 'mission user with this email already exists.') {
                setRequestError({
                    fr: "Un compte existe déjà avec cette adresse e‑mail.",
                    en: "An account already exists with this email address."
                })
            }
        })
    }

    const onSubmitSuccess = (data)=>{
        navigate('/login');
    }

    const onLastSubmit = ()=>{
        const formData = new FormData();
        const user_type = form.type;
        const errorsTMP = Validator.validate(user_type === 'company' ? companyForm: {}, user_type === 'company' ? companyValidationRules: {});
        setErrors({});
        setRequestError(null);

        if (Object.keys(errorsTMP).length === 0) {
            formData.append('username', form.username);
            formData.append('email', form.email);
            formData.append('password', form.password);
            formData.append('user_type', form.type);
            if (user_type === "company") {
                formData.append('name', companyForm.name);
                formData.append('description', companyForm.description);
                formData.append('picture', companyForm.picture);
            }
            Connection.post('auth/register/', formData, onSubmitSuccess, onSubmitFailure, setLoading);
        } else {
            setErrors(errorsTMP);
        }

    }

    useEffect(()=>{
        document.title = "Register - STM"
    })

    return (
        <div className={`min-h-screen bg-[#01406c15]`}>
            <Container className={`flex justify-center pt-[150px] pb-[100px]`}>
                <div className={`w-full md:w-[90%] bg-white rounded-2xl lg:w-[60%] xl:w-[50%] p-3 ps-5 pe-5`}>
                    <div className={`flex justify-center`}>
                        <Link to={'/'}>
                            <img src={logo} alt="STM brand" className={`w-29`} />
                        </Link>
                    </div>

                    {/* Initial */}
                    {
                        step === 'initial' &&
                        <div>
                            <FormControl className={`w-full mt-5!`}>
                                <FormLabel className={`text-[19px]! roboto`}>Email address</FormLabel>
                                <Input placeholder="Enter your email" type='email' name='email' onChange={(e)=>handleChange(e, setForm)} value={form.email} className={`mt-1 h-[45px] roboto`}/>
                                {
                                    errors.email && <ErrorBox content={errors.email} />
                                }
                            </FormControl>
                            <FormControl className={`w-full mt-5!`}>
                                <FormLabel className={`text-[19px]! roboto`}>Username</FormLabel>
                                <Input placeholder="Enter your username" name="username" onChange={(e)=>handleChange(e, setForm)} value={form.username} className={`mt-1 h-[45px] roboto`}/>
                                {
                                    errors.username && <ErrorBox content={errors.username}/>
                                }
                            </FormControl>
                            <FormControl className={`w-full mt-5!`}>
                                <FormLabel className={`text-[19px]! roboto`}>Password</FormLabel>
                                <Input placeholder="Enter your password" type={showPassword ? 'text': 'password'} name="password" onChange={(e)=>handleChange(e, setForm)} value={form.password} className={`mt-1 h-[45px] roboto`} endDecorator={
                                    <IconButton onClick={()=>togglePasswordVisibility()}>
                                        {
                                            showPassword ? <IoEyeOffOutline className={``}/>: <IoEyeOutline className={``} />
                                        }
                                    </IconButton>
                                } />
                                {
                                    errors.password && <ErrorBox content={errors.password} />
                                }
                            </FormControl>
                            <FormControl className={`w-full mt-5!`}>
                                <FormLabel className={`text-[19px]! roboto`}>Password confirmation</FormLabel>
                                <Input placeholder="Confirm your password" type={showPassword ? 'text': 'password'} name="confirm_password" onChange={(e)=>handleChange(e, setForm)} value={form.confirm_password} className={`mt-1 h-[45px] roboto`} endDecorator={
                                    <IconButton onClick={()=>togglePasswordVisibility()}>
                                        {
                                            showPassword ? <IoEyeOffOutline className={``}/>: <IoEyeOutline className={``} />
                                        }
                                    </IconButton>
                                } />
                                {
                                    errors.confirm_password && <ErrorBox content={errors.confirm_password} />
                                }
                            </FormControl>
                            <div className="mt-6">
                                <Button onClick={onFirstStepSubmit} className="bg-blue-main text-white! roboto-medium h-[50px] w-full">
                                    Continue
                                </Button>
                            </div>
                            <p className={`mt-5 roboto-light text-center mb-5`}>Do you have an account? <Link className="text-sky hover:underline roboto-medium" to={'/login'} >Sign in now</Link></p>
                        </div>
                    }

                    {/* user_type */}
                    {
                        step === 'user_type' &&
                        <div className={`mt-5`}>
                            <FormControl className={`w-full`}>
                                <div className="flex justify-start">
                                    <IconButton onClick={()=>setStep('initial')} className="border! border-gray-200! p-1!">
                                        <IoIosArrowBack className="text-gray-500"/>
                                    </IconButton>
                                </div>
                                <FormLabel className={`roboto-medium mt-5 text-[18px]!`}>Select user type</FormLabel>
                                <div className={`mt-4 gap-3 grid grid-cols-12`}>
                                    {
                                        userTypeOptions.map((type, index)=>(
                                            <div onClick={()=>{
                                                if (type.value === 'student') {
                                                    onCompanyFormReset();
                                                }
                                                setForm({
                                                    ...form,
                                                    ['type']: type.value
                                                })
                                            }} key={index} className={`h-[90px] p-3 col-span-12 md:col-span-6 rounded-xl cursor-pointer border transition-colors border-gray-200 ${form.type === type.value ? 'border-sky text-sky bg-[#00aabc12]': 'text-gray-main hover:bg-gray-100 bg-gray-50/20'}`}>
                                                <div className={`flex justify-between items-center`}>
                                                    <type.icon className={`text-[28px]`}/>
                                                    {
                                                        form.type === type.value ?
                                                        <FaCheckCircle className={`text-sky`} />:
                                                        <GoDot className={`text-gray-500 text-[20px]`}/>
                                                    }
                                                </div>
                                                <h6 className={`mt-1 text-[19px] roboto`}>{type.label}</h6>
                                            </div>
                                        ))
                                    }
                                </div>
                            </FormControl>
                            {
                                form.type === 'company' &&
                                <div className={``}>
                                    <FormControl className={`w-full mt-5!`}>
                                        <FormLabel className={`text-[19px]! roboto`}>Company name</FormLabel>
                                        <Input placeholder="Enter your company name" name="name" onChange={(e)=>handleChange(e, setCompanyForm)} value={companyForm.name} className={`mt-1 h-[45px] roboto`}/>
                                        {
                                            errors.name && <ErrorBox content={errors.name} />
                                        }
                                    </FormControl>
                                    <FormControl className={`w-full mt-5!`}>
                                        <FormLabel className={`text-[19px]! roboto`}>Description</FormLabel>
                                        <Textarea  minRows={5} placeholder="Enter company description" name="description" onChange={(e)=>handleChange(e, setCompanyForm)} value={companyForm.description} className={`mt-1 roboto`}/>
                                        {
                                            errors.description && <ErrorBox content={errors.description}/>
                                        }
                                    </FormControl>
                                    <FormControl className={`w-full mt-5!`}>
                                        <FormLabel className={`text-[19px]! roboto`}>Company picture</FormLabel>
                                        <ImageInput setImage={(value)=>{
                                            setCompanyForm((prev)=>(
                                                value ?
                                                {...prev, ['picture']: value}: {...prev}
                                            ))
                                        }} ID={'company-pic'} className={`w-[250px] border border-gray-200 rounded-md mt-2!`} />
                                        {
                                            errors.picture && <ErrorBox content={errors.picture} />
                                        }
                                    </FormControl>
                                </div>
                            }

                            <div className={`mt-5`}>
                                {
                                    requestError && <ErrorBox content={requestError} />
                                }
                                <Button onClick={onLastSubmit} disabled={loading} className={`h-[50px] w-full bg-blue-main text-white! roboto`}>
                                    {
                                        loading ?
                                        <CircularProgress size={19} sx={{
                                            color: 'white'
                                        }}/>:
                                        <>Sign up</>
                                    }
                                </Button>
                            </div>
                        </div>
                    }

                </div>
            </Container>
        </div>
    )
}

export default Register;
