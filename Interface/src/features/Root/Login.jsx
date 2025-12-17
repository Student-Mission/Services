import { Button, CircularProgress, Container, FormControl, FormLabel, IconButton } from "@mui/material"
import logo from "../../assets/images/stm.png";
import { Link, useNavigate } from "react-router-dom";
import { Input, Textarea } from "@mui/joy";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useContext, useEffect, useState } from "react";
import login from "../../services/root/login";
import loginRules from "./rules/login";
import Validator from "../../lib/validations/validator";
import ErrorBox from "../../components/ui/ErrorBox";
import { GlobalContext } from "../../contexts/Global";

function Login() {

    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [mainError, setMainError] = useState(null);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        email: '',
        password: ''
    })
    useEffect(()=>{
        document.title = 'Login - STM'
    }, [])

    const {setSkills, setProfile} = useContext(GlobalContext);

    const handleChange = (event)=>{
        setForm({
            ...form,
            [event.target.name]: event.target.value
        })
    }

    const togglePasswordVisibility = ()=>{
        setShowPassword(!showPassword);
    }

    const handleSubmit = ()=>{
        if (loading)
            return;
        setMainError(null);
        setErrors({});
        const formErrors = Validator.validate(form, loginRules);

        if (Object.keys(formErrors).length === 0) {
            login(form, setLoading, setMainError, navigate, (data)=>{
                setSkills(data.available_skills);
                setProfile(data.profile);
            });
        } else {
            setErrors(formErrors);
        }
    }

    return (
        <div className={`min-h-screen bg-[#01406c15]`}>
            <Container className={`flex justify-center pt-[150px] pb-[100px]`}>
                <div className={`w-full md:w-[90%] bg-white rounded-2xl lg:w-[60%] xl:w-[50%] p-3 ps-5 pe-5`}>
                    <div className={`flex justify-center`}>
                        <Link to={'/'}>
                            <img src={logo} alt="STM brand" className={`w-29`} />
                        </Link>
                    </div>
                    <FormControl className={`w-full mt-5!`}>
                        <FormLabel className={`text-[19px]! roboto`}>Email address</FormLabel>
                        <Input error={errors.email} placeholder="Enter your email" type='email' name="email" onChange={handleChange} value={form.email} className={`mt-1 h-[45px] roboto`}/>
                        {
                            errors.email && <ErrorBox content={errors.email} />
                        }
                    </FormControl>
                    <FormControl className={`w-full mt-5!`}>
                        <FormLabel className={`text-[19px]! roboto`}>Password</FormLabel>
                        <Input error={errors.password} name="password" value={form.password} onChange={handleChange} placeholder="Enter your password" type={showPassword ? 'text': 'password'} className={`mt-1 h-[45px] roboto`} endDecorator={
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
                    {
                        mainError && <ErrorBox content={mainError} />
                    }
                    <div className="mt-6">
                        <Button disabled={loading} onClick={handleSubmit} className="bg-blue-main text-white! roboto-medium h-[50px] w-full">
                            {
                                loading ?
                                <CircularProgress size={18} sx={{
                                    color: 'white'
                                }} />:
                                'Login'
                            }
                        </Button>
                    </div>
                    <p className={`mt-5 roboto-light text-center mb-5`}>Don't have an account? <Link className="text-sky hover:underline roboto-medium" to={'/register'} >Sign up now</Link></p>
                </div>
            </Container>
        </div>
    )
}

export default Login;
