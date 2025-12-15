import { createContext, useEffect, useState } from "react";
export const GlobalContext = createContext();
import Connection from "../services/Connection";
import { useNavigate } from "react-router-dom";

export const GlobalProvider = ({children})=>{

    const [skills, setSkills] = useState([]); // Available skills
    const [navExtended, setNavExtended] = useState(true); // True when sidebar is extended
    const [mainLoading, setMainLoading] = useState(true); // True when client is fetching data in background
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        bio: '',
        picture: 'none'
    })
    const [logged, setLogged] = useState(false);
    const navigate = useNavigate();

    const skillsFetchErrorHandler = (error)=>{
        if (error.response) {
            if (error.response.status === 401) {
                setLogged(false);
                navigate('/login');
            }
        } else {
            alert('Network error')
        }
    }

    const checkAuth = ()=>{
        Connection.get('user/check-auth/', (data)=>{
            setLogged(true);
            setProfile(data);
            Connection.get('user/skills/', (skillsData)=>{
                setSkills(skillsData.skills);
            }, skillsFetchErrorHandler, setMainLoading, true);
        }, (error)=>{
            setMainLoading(false);
            if (error.response) {
                if (error.response.status === 401) {
                    setLogged(false);
                    navigate('/');
                }
            } else {
                alert('Network error')
            }
        }, null, true);
    }

    useEffect(()=>{
        checkAuth();
    }, [])

    return (
        <GlobalContext.Provider value={{
            navExtended, setNavExtended,
            profile, setProfile,
            mainLoading, setMainLoading,
            logged, setLogged, skills
        }} >
            {children}
        </GlobalContext.Provider>
    )
}

