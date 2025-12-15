// import loginRules from "../../features/Root/rules/login";
import Connection from "../Connection";
import Validator from "../../lib/validations/validator";

function login(form, setLoading, setError, navigate) {
    const url = 'login/';

    const successHandler = (data)=>{
        localStorage.setItem('refresh', data.refresh);
        localStorage.setItem('access', data.access);
        console.log(data);
        if (data.role === 'business') {
            navigate('/company');
        } else {
            navigate('/');
        }
    }

    const failureHandler = (error)=>{
        console.log(error);
        if (error.response && error.response.data.error === 'Bad password') {
            setError({
                fr: 'Identifiants incorrects',
                en: 'Invalid credentials'
            })
            return;
        }
        if (error.response && error.response.status === 400) {
            setError({
                fr: 'Erreur inattendue',
                en: 'Unexpected error'
            })
        }
    }

    Connection.post(url, form, successHandler, failureHandler,setLoading);
}

export default login;
