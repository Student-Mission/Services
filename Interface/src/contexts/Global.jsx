import { createContext, useEffect, useRef, useState } from "react";
export const GlobalContext = createContext();
import Connection from "../services/Connection";
import { useNavigate } from "react-router-dom";
import useCache from "../hooks/useCache";

const BACKEND_API = import.meta.env.VITE_API_URL;

export const GlobalProvider = ({children})=>{

    const [skills, setSkills] = useState([]); // Available skills
    const [navExtended, setNavExtended] = useState(true); // True when sidebar is extended
    const [companyMissions, setCompanyMissions] = useCache(40);
    const [mainLoading, setMainLoading] = useState(true); // True when client is fetching data in background
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        bio: '',
        picture: 'none'
    }) // User standard profile
    const [logged, setLogged] = useState(false);
    const [alerts, setAlerts] = useState([]);
    const navigate = useNavigate();


    const checkAuth = ()=>{
        Connection.get('auth/user/', (data)=>{
            setLogged(true);
            setProfile(data.profile);
            setSkills(data.available_skills);
            setAlerts(data.alerts);
            // initializeWebSocket();
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
        }, setMainLoading, true);
    }
    const [access, setAccess] = useState(localStorage.getItem('access'));
    const [socket, setSocket] = useState(null);
    const socketRef = useRef(null);
    const connectingRef = useRef(null);

    useEffect(()=>{
        checkAuth();
        const onStorageChange = (e)=>{
            if (e.key === 'access') {
                setAccess(e.newValue);
            }
        }
        window.addEventListener("storage", onStorageChange);
        return ()=> {
            window.removeEventListener('storage', onStorageChange);
            if (socketRef.current) {
                try {
                    socketRef.current.close();
                } catch {}
                socketRef.current = null;
            }
        }
    }, [])
    
    useEffect(()=>{
        if (!access) return;
        initializeWebSocket(access)
    
    }, [access])


    const handleAlertReception = (event)=>{
        let payload = null;
        try {
            payload = JSON.parse(event.data).data;
        } catch (err) {
            console.error('Failed to parse websocket message', err)
            return;
        }
        let newAlert = {
            ...payload,
            ['new']: true
        };
        let oldAlerts = alerts;
        oldAlerts.push(newAlert);
        setAlerts(oldAlerts);
    }
    
    const initializeWebSocket = (token)=>{
       if (!token)
            return;
        if (connectingRef.current)
            return;

        // Avoid opening if an open socket already exists
        if (socketRef.current && socket.current.readyState === WebSocket.OPEN)
            return;

        connectingRef.current = true;

        Connection.get('ws-auth/auth_for_ws_connection/', (data)=>{
            const uuid = data.uuid;
            const WS_URL = BACKEND_API.replace('http://', 'ws://') + `ws/alerts/?uuid=` + encodeURIComponent(uuid);
            
            // Close previous socket
            if (socketRef.current) {
                try {
                    socket.current.close();
                } catch {}
                socketRef.current = null;
            }

            const ws = new WebSocket(WS_URL);
            
            ws.onopen = ()=> {
                console.log("Socket open")
                connectingRef.current = false;
                socketRef.current = ws;
            };
            ws.onclose = ()=> {
                console.log("Socket gracefully closed");
                if (socketRef.current === ws)
                    socketRef.current = null;
            }
            ws.onerror = (err)=>{
                console.warn("Websocket error", err);
            }
            ws.onmessage = handleAlertReception;
            setSocket(ws);
        }, (error)=>{
            connectingRef.current = false;
            console.log("Failed to establish websocket connection");
        }, null, true)
        
    }

    // Websockets

    return (
        <GlobalContext.Provider value={{
            navExtended, setNavExtended,
            profile, setProfile,
            mainLoading, setMainLoading,
            logged, setLogged, skills, setSkills, companyMissions, setCompanyMissions,
            alerts, setAlerts, initializeWebSocket
        }} >
            {children}
        </GlobalContext.Provider>
    )
}

