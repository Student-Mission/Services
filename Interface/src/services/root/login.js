// import loginRules from "../../features/Root/rules/login";
import Connection from "../Connection";
import Validator from "../../lib/validations/validator";
import { requestFailureHandler } from "../../lib/utils";

function login(form, setLoading, setError, navigate, handle) {
    const url = 'auth/login/';

    const successHandler = (data)=>{
        localStorage.setItem('refresh', data.refresh);
        localStorage.setItem('access', data.access);
        handle(data)
        // console.log(data);
        if (data.type === 'company') {
            navigate('/company');
        } else if (data.type === 'student') {
            navigate("/student")
        } 
        else {
            navigate('/');
        }
    }

    const failureHandler = (error)=>{
        requestFailureHandler(error, setError, navigate, (data)=>{
            console.log(data);
            if (data.detail && data.detail instanceof Array && data.detail.length > 0 && data.detail[0] === 'Invalid credentials') {
                setError({
                    fr: "Identifiants de connexion incorrects",
                    en: "Invalid login credentials"
                })
            } else {
                setError({
                    fr: "Formulaire invalide",
                    en: "Invalid form"
                })
            }
        })
        // console.log(error);
        // if (error.response && error.response.data.error === 'Bad password') {
        //     setError({
        //         fr: 'Identifiants incorrects',
        //         en: 'Invalid credentials'
        //     })
        //     return;
        // }
        // if (error.response && error.response.status === 400) {
        //     setError({
        //         fr: 'Erreur inattendue',
        //         en: 'Unexpected error'
        //     })
        // }
    }

    Connection.post(url, form, successHandler, failureHandler,setLoading);
}

export default login;
