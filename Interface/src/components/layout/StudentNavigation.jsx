import { Avatar, Container, IconButton } from "@mui/material";
import logo from "../../assets/images/stm.png";
import { Link } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegBell } from "react-icons/fa6";
import { GoBell } from "react-icons/go";

function StudentNavigation() {

    const links = [
        {
            label: 'Dashboard',
            value: 'dashboard',
            path: '/student'
        },
        {
            label: 'Find Missions',
            value: 'find-missions',
            path: '/student/find-missions'
        },
        {
            label: 'Learn',
            value: 'learn',
            path: '/student/learn'
        }
    ]

    return (
        <div className={`fixed bg-white z-30 top-0 left-0 h-16 xl:h-20 w-full border-b border-gray-200`}>
            <Container className={`grid h-full grid-cols-12`}>
                <div className={`col-span-6 xl:col-span-3 flex items-center`}>
                    <Link to={"/student"}>
                        <img src={logo} alt="Student mission brand" className={`w-16 md:w-20`} />
                    </Link>
                </div>
                <div className={`col-span-0 h-full hidden xl:flex items-center justify-center gap-7 xl:col-span-6`}>
                    {
                        links.map((link, index)=>(
                            <Link to={link.path} key={index} className={`ps-4 roboto text-[18px] py-3 pe-4`}>
                                {link.label}
                            </Link>
                        ))
                    }
                </div>
                <div className={`col-span-0 gap-4 hidden xl:flex items-center justify-end xl:col-span-3`}>
                    <IconButton>
                        <IoSettingsOutline className={`text-gray-main text-2xl`}/>
                    </IconButton>
                    <Link to={'/student/alerts'}>
                        <GoBell className={`text-2xl text-gray-main`}/>
                    </Link>
                    <Link to={'/student/profile'}>
                        <Avatar src="none" alt="Abiola Shadow" className={`bg-blue-main`} />
                    </Link>
                </div>
                <div className={``}>

                </div>
            </Container>
        </div>
    )
}

export default StudentNavigation;
