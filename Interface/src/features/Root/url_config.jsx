import Home from "./Home";
import StudentPanel from "./StudentPanel";
import CompanyPanel from "./CompanyPanel";
import Contact from "./Contact";
import Register from "./Register";
import Login from "./Login";

const root_urls = [
    {path: '/', component: <Home/>},
    {path: '/for-students', component: <StudentPanel/>},
    {path: '/for-companies', component: <CompanyPanel/>},
    {path: '/contact', component: <Contact/>},
    {path: '/register', component: <Register/>},
    {path: '/login', component: <Login/>}
]

export default root_urls;