import api from "./Api";


class Connection {

    static refresh(setLoading=null, handle=null, errorHandle=null) {
        const url = "auth/refresh/";
        const refreshToken = localStorage.getItem('refresh');
        setLoading?.(true);
        api.post(url, {
            refresh: refreshToken
        }, {
            
        })
        .then((response)=>{
            const data = response.data;
            localStorage.setItem('access', data.access);
            // localStorage.setItem('refresh', data.refresh);
            handle?.();
            // setLoading?.(false);
        })
        .catch((error)=>{
            errorHandle?.(error);
        })
        
    }

    static post(path='', data={}, successHandler=null, failureHandler=null, setLoading=null, secure=false) {
        const token = secure ? localStorage.getItem('access') : null;
        setLoading?.(true);

        const newHandler = ()=>{
            this.post(path, data, successHandler, failureHandler, setLoading, secure)
        }

        api.post(path, data, secure ? {
            
            headers: {
                Authorization: `Bearer ${token}`
            }
        }: {})
        .then((response)=>{
            successHandler?.(response.data)
            setLoading?.(false);
        })
        .catch((error)=>{
            if (error.response.status === 401 && secure) {
                this.refresh(setLoading, newHandler, failureHandler)
            } else {
                failureHandler?.(error)
                setLoading?.(false);
            }
        })
        .finally(()=>{
            // setLoading?.(false);
        })
    }

    static patch(path='', data={}, successHandler=null, failureHandler=null, setLoading=null, secure=false) {
        const token = secure ? localStorage.getItem('access') : null;
        setLoading?.(true);

        const newHandler = ()=>{
            this.patch(path, data, successHandler, failureHandler, setLoading, secure)
        }

        api.patch(path, data, secure ? {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }: {})
        .then((response)=>{
            successHandler?.(response.data)
            setLoading?.(false);
        })
        .catch((error)=>{
            if (error.response.status === 401 && secure) {
                this.refresh(setLoading, newHandler, failureHandler)
            } else {
                failureHandler?.(error)
                setLoading?.(false);
            }
        })
        .finally(()=>{
            // setLoading?.(false);
        })
    }

    static get(path='', successHandler=null, failureHandler=null, setLoading=null, secure=false) {
        const token = secure ? localStorage.getItem('access') : null;
        setLoading?.(true);

        const newHandler = ()=>{
            this.get(path, successHandler, failureHandler, setLoading, secure);
        }

        api.get(path, secure ? {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }: {})
        .then((response)=>{
            successHandler?.(response.data);
            setLoading?.(false);
        })
        .catch((error)=>{
            // failureHandler?.(error);
            if (error.response.status === 401 && secure) {
                this.refresh(setLoading, newHandler, failureHandler)
            } else {
                failureHandler?.(error)
                setLoading?.(false);
            }
        })
        .finally(()=>{
            setLoading?.(false);
        })
    }

    static put(path='', data={}, successHandler=null, failureHandler=null, setLoading=null, secure=false) {
        const token = secure ? localStorage.getItem('access') : null;
        setLoading?.(true);

        const newHandler = ()=>{
            this.put(path, data, successHandler, failureHandler, setLoading, secure)
        }
        
        api.put(path, data, secure ? {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }: {})
        .then((response)=>{
            successHandler?.(response.data)
            setLoading?.(false);
        })
        .catch((error)=>{
            // failureHandler?.(error)
            // console.error(error);
            if (error.response.status === 401 && secure) {
                this.refresh(setLoading, newHandler, failureHandler)
            } else {
                failureHandler?.(error)
                setLoading?.(false);
            }
        })
        .finally(()=>{
            // setLoading?.(false);
        })
    }

};

export default Connection;
