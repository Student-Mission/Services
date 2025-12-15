import { useEffect, useState } from "react";
import { Button, Container, FormControl, FormLabel, IconButton } from "@mui/material"
import logo from "../../assets/images/stm.png";
import { Input, Textarea } from "@mui/joy";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { GoDot } from "react-icons/go";
import { FaCheckCircle } from "react-icons/fa";
import { PiStudentLight } from "react-icons/pi";
import { IoBusinessOutline } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";

function Register() {

    const [showPassword, setShowPassword] = useState(false);

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
                                <Input placeholder="Enter your email" type='email' className={`mt-1 h-[45px] roboto`}/>
                            </FormControl>
                            <FormControl className={`w-full mt-5!`}>
                                <FormLabel className={`text-[19px]! roboto`}>Username</FormLabel>
                                <Input placeholder="Enter your username" className={`mt-1 h-[45px] roboto`}/>
                            </FormControl>
                            <FormControl className={`w-full mt-5!`}>
                                <FormLabel className={`text-[19px]! roboto`}>Password</FormLabel>
                                <Input placeholder="Enter your password" type={showPassword ? 'text': 'password'} className={`mt-1 h-[45px] roboto`} endDecorator={
                                    <IconButton onClick={()=>togglePasswordVisibility()}>
                                        {
                                            showPassword ? <IoEyeOffOutline className={``}/>: <IoEyeOutline className={``} />
                                        }
                                    </IconButton>
                                } />
                            </FormControl>
                            <FormControl className={`w-full mt-5!`}>
                                <FormLabel className={`text-[19px]! roboto`}>Password confirmation</FormLabel>
                                <Input placeholder="Confirm your password" type={showPassword ? 'text': 'password'} className={`mt-1 h-[45px] roboto`} endDecorator={
                                    <IconButton onClick={()=>togglePasswordVisibility()}>
                                        {
                                            showPassword ? <IoEyeOffOutline className={``}/>: <IoEyeOutline className={``} />
                                        }
                                    </IconButton>
                                } />
                            </FormControl>
                            <div className="mt-6">
                                <Button onClick={()=>setStep('user_type')} className="bg-blue-main text-white! roboto-medium h-[50px] w-full">
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
                                        <Input placeholder="Enter your company name" className={`mt-1 h-[45px] roboto`}/>
                                    </FormControl>
                                    <FormControl className={`w-full mt-5!`}>
                                        <FormLabel className={`text-[19px]! roboto`}>Description</FormLabel>
                                        <Textarea minRows={5} placeholder="Enter company description" className={`mt-1 roboto`}/>
                                    </FormControl>
                                </div>
                            }

                            <div className={`mt-5`}>
                                <Button className={`h-[50px] w-full bg-blue-main text-white! roboto`}>Sign up</Button>
                            </div>
                        </div>
                    }

                </div>
            </Container>
        </div>
    )
}

export default Register;
