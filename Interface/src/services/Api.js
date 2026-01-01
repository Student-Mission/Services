import axios from "axios";
const API = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API,
    timeout: 30000,
})

export default api;
