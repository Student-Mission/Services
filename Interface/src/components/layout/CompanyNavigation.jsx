import logo from "../../assets/images/stm.png";
import { Input } from "@mui/joy";
import { CiMenuBurger, CiSearch } from "react-icons/ci";
import { Avatar, Drawer, IconButton, Button, CircularProgress, Badge, Menu } from "@mui/material";
import { FiBell } from "react-icons/fi";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { useEffect, useRef, useState } from "react";
import { GoPlus, GoStack } from "react-icons/go";
import { MdDashboard, MdOutlineDashboard, MdOutlineSettings, MdSettings, MdHelpOutline, MdHelp, MdCancel} from "react-icons/md";
import { FaUser, FaRegUser } from "react-icons/fa6";
import { HiMiniSquare3Stack3D } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../contexts/Global";
import { useContext } from "react";
import {AiOutlineMenu} from "react-icons/ai";

function MiniMenu({show, onHide, anchor}) {

    const navigate = useNavigate();

    const handleLogout = ()=>{
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        navigate("/");
    }

    return (
        <Menu open={show} onClose={onHide} anchorEl={anchor}>
            <div className={`w-[250px] py-3 px-4`}>
                <Button onClick={handleLogout} sx={{
                    textTransform: "none"
                }} className={`h-[38px] w-full bg-blue-main text-white! roboto`}>
                    Logout
                </Button>

            </div>
        </Menu>
    )
}

function MobileSidebar({show, onHide, links, current}) {

    const expanded = true;
    const navigate = useNavigate();

    return (
        <Drawer open={show} onClose={onHide} className="" >
            <div className={`w-[250px] bg-white`}>
                <div className={`flex items-center p-3 pt-0 pb-0 mt-4 justify-between`}>
                    <h5 className={` text-xl roboto-medium`}>Menu</h5>
                    <IconButton onClick={onHide}>
                        <MdCancel/>
                    </IconButton>
                </div>
                <div className={`p-3 pt-0 mt-2`}>
                    <Button onClick={()=>navigate('/company/new-mission')} sx={{
                        textTransform: 'none'
                    }} className={`gap-1 transition-transform duration-200 ease-in-out ${!expanded ? 'w-10 min-w-0!': 'w-full'} h-10 text-white! roboto text-[14px]! bg-blue-main`}>
                        <GoPlus className={`text-[27px] ${!expanded && 'text-[18px]!'}`}/>
                        {
                            expanded &&
                            'New mission'
                        }
                    </Button>
                </div>
                <div className={`mt-0 p-4 ps-0 pe-0 pt-4 ${!expanded && ''}`}>
                    {
                        links.menu.map((link, index)=>(
                            <div key={index} className={`h-10 mb-3`}>
                                <Link to={link.path} className={`w-full h-full ps-3 transition no-underline! flex items-center ${link.label === current ? 'bg-[#01406c11] text-[#01406c]': 'text-gray-500 hover:bg-[#01406c11]'}`} >
                                    {
                                        link.label === current ?
                                        <link.focusIcon className={`text-[27px] text-blue-main ${!expanded && ''}`} />:
                                        <link.icon className={`text-[27px] ${!expanded && 'text-[29px]'}`} />
                                    }
                                    <span className={`roboto ms-3 text-md mb-0 ${!expanded && 'hidden'}`}>
                                        {link.displayed}
                                    </span>
                                </Link>
                            </div>
                        ))
                    }
                </div>
                
                <div className={`mt-4 p-3 pt-0 pb-0`}>
                    <h5 className={`${!expanded && "hidden"} text-xl roboto-medium`}>Account</h5>
                </div>
                <div className={`mt-0 p-4 ps-0 pe-0 pt-4 ${!expanded && ''}`}>
                    {
                        links.account.map((link, index)=>(
                            <div key={index} className={`h-10 mb-3`}>
                                <Link to={link.path} className={`w-full h-full ps-3 transition no-underline! flex items-center ${link.label === current ? 'bg-[#01406c11] text-[#01406c]': 'text-gray-500 hover:bg-[#01406c11]'}`} >
                                    {
                                        link.label === current ?
                                        <link.focusIcon className={`text-[27px] text-blue-main ${!expanded && ''}`} />:
                                        <link.icon className={`text-[27px] ${!expanded && 'text-[29px]'}`} />
                                    }
                                    <span className={`roboto ms-3 text-md mb-0 ${!expanded && 'hidden'}`}>
                                        {link.displayed}
                                    </span>
                                </Link>
                            </div>
                        ))
                    }
                </div>
            </div>
        </Drawer>
    )
}

function Sidebar({links={menu: [], account: []}, show, expanded, setExpanded, current, showMobileMenu, setShowMobileMenu}) {

    useEffect(()=>{
        setExpanded(show);
    }, [show])

    const navigate = useNavigate();

    return (
        <div style={{ transition: 'width 260ms ease-in-out' }} className={`hidden lg:block ${!show && 'hidden!'} fixed overflow-x-hidden pt-22 bg-white top-0 ${expanded ? 'w-[250px]': 'w-[60px]'} h-full shadow-2xs border border-gray-200`}>
            <div className={`w-[250px]`}>
                <div className={`flex items-center p-3 pt-0 pb-0 mt-4 ${!expanded && 'ps-2'} justify-between`}>
                    <h5 className={`${!expanded && 'hidden'} text-xl roboto-medium`}>Menu</h5>
                    <IconButton className={`${!expanded && 'ms-4'}`} onClick={()=>setExpanded(!expanded)}>
                        {
                            !expanded ?
                            <GoSidebarCollapse className={``}/>:
                            <GoSidebarExpand className={``}/>
                        }
                    </IconButton>
                </div>
                <div className={`p-3 pt-0 mt-2 ${!expanded && 'ps-2'}`}>
                    <Button onClick={()=>navigate('/company/new-mission')} sx={{
                        textTransform: 'none'
                    }} className={`gap-1 transition-transform duration-200 ease-in-out ${!expanded ? 'w-10 min-w-0!': 'w-full'} h-10 text-white! roboto text-[14px]! bg-blue-main`}>
                        <GoPlus className={`text-[27px] ${!expanded && 'text-[18px]!'}`}/>
                        {
                            expanded &&
                            'New mission'
                        }
                    </Button>
                </div>
                <div className={`mt-0 p-4 ps-0 pe-0 pt-4 ${!expanded && ''}`}>
                    {
                        links.menu.map((link, index)=>(
                            <div key={index} className={`h-10 mb-3`}>
                                <Link to={link.path} className={`w-full h-full ps-3 transition no-underline! flex items-center ${link.label === current ? 'bg-[#01406c11] text-[#01406c]': 'text-gray-500 hover:bg-[#01406c11]'}`} >
                                    {
                                        link.label === current ?
                                        <link.focusIcon className={`text-[27px] text-blue-main ${!expanded && ''}`} />:
                                        <link.icon className={`text-[27px] ${!expanded && 'text-[29px]'}`} />
                                    }
                                    <span className={`roboto ms-3 text-md mb-0 ${!expanded && 'hidden'}`}>
                                        {link.displayed}
                                    </span>
                                </Link>
                            </div>
                        ))
                    }
                </div>
                
                <div className={`mt-4 p-3 pt-0 pb-0`}>
                    <h5 className={`${!expanded && "hidden"} text-xl roboto-medium`}>Account</h5>
                </div>
                <div className={`mt-0 p-4 ps-0 pe-0 pt-4 ${!expanded && ''}`}>
                    {
                        links.account.map((link, index)=>(
                            <div key={index} className={`h-10 mb-3`}>
                                <Link to={link.path} className={`w-full h-full ps-3 transition no-underline! flex items-center ${link.label === current ? 'bg-[#01406c11] text-[#01406c]': 'text-gray-500 hover:bg-[#01406c11]'}`} >
                                    {
                                        link.label === current ?
                                        <link.focusIcon className={`text-[27px] text-blue-main ${!expanded && ''}`} />:
                                        <link.icon className={`text-[27px] ${!expanded && 'text-[29px]'}`} />
                                    }
                                    <span className={`roboto ms-3 text-md mb-0 ${!expanded && 'hidden'}`}>
                                        {link.displayed}
                                    </span>
                                </Link>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className=" lg:hidden">
                <MobileSidebar current={current} links={links} show={showMobileMenu} onHide={()=>setShowMobileMenu(false)} />
            </div>

        </div>
    )
}

function Header({showMobileMenu, setShowMobileMenu}) {

    // const profile = {
    //     username: 'Josias Dash',
    //     picture: 'none'
    // }

    const {mainLoading, profile, alerts} = useContext(GlobalContext);
    
    const getNewAlerts = (_alerts=[])=>{
        return _alerts.filter((v)=>v.new).length;
    }
    const [showMenu, setShowMenu] = useState(false);
    const menuAnchor = useRef(null);

    return (
        <div className={`fixed z-50 bg-white top-0 left-0 w-full h-16 md:h-20 lg:ps-4 lg:pe-4 shadow-2xs border border-gray-200`}>
            <div className={`flex items-center h-full justify-between`}>
                <div className={`h-full flex items-center gap-3`}>
                    <div className={`flex lg:hidden`}>
                        <IconButton onClick={()=>setShowMobileMenu(true)}>
                            <AiOutlineMenu/>
                        </IconButton>
                    </div>
                    <Link to={'/company'}>
                        <img src={logo} alt="stm brand" className={`w-14 md:w-16 lg:w-20`} />
                    </Link>
                    <Input type='search' placeholder="Search something" className={`h-[45px] hidden! lg:flex!`} startDecorator={
                        <CiSearch className={`text-[24px]`}/>
                    } />
                </div>

                <div className={`h-full flex items-center gap-2 md:gap-4 justify-end`}>
                    <IconButton className={`lg:hidden!`}>
                        <CiSearch className={`text-[29px]`}/>
                    </IconButton>
                    <Link to={`/company/alerts`} className="">
                        <Badge badgeContent={getNewAlerts(alerts)} color='error' className={`flex items-center cursor-pointer justify-center h-10 w-11 group rounded-lg bg-gray-100 transition duration-200 ease-in-out hover:bg-gray-200`}>
                            {/* <div className={`flex items-center cursor-pointer justify-center h-10 w-11 group rounded-lg bg-gray-100 transition duration-200 ease-in-out hover:bg-gray-200`}> */}
                                    <FiBell className={`text-[21px] text-gray-main group-hover:text-gray-900!`}/>
                            {/* </div> */}
                        </Badge>
                    </Link>

                    {
                        mainLoading ?
                        <CircularProgress size={18} sx={{
                            color: '#01406c'
                        }} />:
                        <div onClick={()=>setShowMenu(true)} ref={menuAnchor} className={`h-10 gap-3 p-1 rounded-lg md:ps-4 cursor-pointer flex items-center bg-gray-100 select-none transition duration-200 ease-in-out hover:bg-gray-200`}>
                            <strong className={`font-normal text-[15px] roboto hidden md:block`}>{profile.username}</strong>
                            <Avatar src={profile.picture} alt={profile.username} className={`h-9!  bg-blue-main`} variant='rounded'  />
                            {
                                menuAnchor.current &&
                                <MiniMenu show={showMenu} onHide={()=>setShowMenu(false)} anchor={menuAnchor.current} />
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

function CompanyNavigation({current='dashboard', showSide=true}) {

    const links = {
        menu: [
            {
                displayed: "Dashboard",
                label: "dashboard",
                path: '/company',
                focusIcon: MdDashboard,
                icon: MdOutlineDashboard
            },
            {
                displayed: "Missions",
                label: "missions",
                path: '/company/missions',
                focusIcon: HiMiniSquare3Stack3D,
                icon: GoStack
            },
        ],
        account: [
            {
                displayed: "Help Center",
                label: "help",
                path: '/company/help',
                focusIcon: MdHelp,
                icon: MdHelpOutline
            },
            {
                displayed: "Settings",
                label: "settings",
                path: '/company/settings',
                focusIcon: MdSettings,
                icon: MdOutlineSettings
            },
        ]
    }

    // const [expanded, setExpanded] = useState(true);
    const {navExtended, setNavExtended} = useContext(GlobalContext);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    return (
        <div>
            <Header showMobileMenu={showMobileMenu} setShowMobileMenu={setShowMobileMenu}/>
            <Sidebar showMobileMenu={showMobileMenu} setShowMobileMenu={setShowMobileMenu} expanded={navExtended} show={showSide} links={links} current={current} setExpanded={setNavExtended} />
        </div>
    )
}

export default CompanyNavigation;
