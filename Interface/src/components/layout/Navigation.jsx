import { Container, Drawer, IconButton, Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import logo from "../../assets/images/stm.png"
import {Button, Select} from "@mui/material";
import { useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

function MobileMenu({links, show, onHide, current, languages, currentLanguage, handleChange}) {

    const navigate = useNavigate();
    return (
        <Drawer anchor='right' className="lg:hidden" open={show} onClose={onHide} sx={{
            
        }} slotProps={{
            paper: {
                sx: {
                    height: '100vh',
                    width: 230,
                    pt: 1
                }
            }
        }} >
            <div className="flex mb-3 w-full items-center justify-end">
                <IconButton onClick={onHide} >
                    <X/>
                </IconButton>
            </div>
            {
                links.map((link, index)=>(
                    <MenuItem key={index} onClick={()=>{navigate(`/${link.label}`)}} className={`transition-colors roboto duration-200 ease-in-out ps-2 pe-2 pt-2 pb-2 ${current === link.label && 'bg-[#01406c21]! text-blue-main'}`} >
                        {link.displayed}
                    </MenuItem>
                ))
            }
            <div className="p-2">
                <Select value={currentLanguage} onChange={handleChange} className={`h-[45px] w-full`}>
                        {
                            languages.map((lang, index)=>(
                                <MenuItem value={lang.label} key={index} className={``} >
                                    {lang.displayed}
                                </MenuItem>
                            ))
                        }
                </Select>
                <Button onClick={()=>navigate('/register')} className={`bg-blue-main text-white! mt-4! text-[14px]! roboto-medium  w-full h-[45px]`}>
                    Get started
                </Button>
            </div>
        </Drawer>
    )
}


function Navigation({current='home'}) {

    const links = [
        {
            label: 'for-students',
            displayed: 'FOR STUDENTS',
        },
        {
            label: 'for-companies',
            displayed: 'FOR COMPANIES'
        },
        // {
        //     label: 'prices-plans',
        //     displayed: 'PRICES AND PLANS'
        // },
        {
            label: 'contact',
            displayed: 'CONTACT'
        }
    ]

    const languages = [
        {
            label: 'en',
            displayed: '🇬🇧 English'
        },
        {
            label: 'fr',
            displayed: '🇫🇷 French'
        }
    ]
    const [currentLanguage, setCurrentLanguage] = useState(languages[0].label);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const navigate = useNavigate();

    const handleChange = (event)=>{
        setCurrentLanguage(event.target.value)
    }

    return (
        <div className={`h-16 md:h-20 w-full bg-white z-50 border border-gray-200 fixed top-0 left-0`}>
            <MobileMenu currentLanguage={currentLanguage} handleChange={handleChange} languages={languages} current={current} links={links} show={showMobileMenu} onHide={()=>setShowMobileMenu(false)} />
            <Container className={`h-full grid grid-cols-12`}>
                <div className={`col-span-6 lg:col-span-3 flex items-center h-full`}>
                    <Link to={"/"}>
                        <img src={logo} alt="Student mission brand" className={`w-16 md:w-20`} />
                    </Link>
                </div>
                <div className={`h-full col-span-0 hidden lg:col-span-5 lg:flex items-center justify-around gap-0`}>
                    {
                        links.map((link, index)=>(
                            <div key={index} className={`hover:bg-[#01406c21] rounded-2xl hover:text-[#01406c] h-[45px] transition-colors duration-200 ease-in-out ${current === link.label && 'bg-[#01406c21] text-blue-main'}`}>
                                <Link to={`/${link.label}`} className={`text-[14px] w-full h-full flex items-center ps-3 pe-3  roboto no-underline!`} >
                                    {link.displayed}
                                </Link>
                            </div>
                        ))
                    }
                </div>
                <div className={`col-span-0 lg:col-span-4 h-full hidden lg:flex items-center justify-end gap-3`}>
                    <Select value={currentLanguage} onChange={handleChange} className={`h-[45px]`}>
                        {
                            languages.map((lang, index)=>(
                                <MenuItem value={lang.label} key={index} className={``} >
                                    {lang.displayed}
                                </MenuItem>
                            ))
                        }
                    </Select>
                    <Button onClick={()=>navigate('/register')} className={`bg-blue-main text-white! text-[14px]! roboto-medium  w-[120px] h-[45px]`}>
                        Get started
                    </Button>
                </div>
                <div className={`col-span-6 md:col-span-0 lg:hidden h-full flex justify-end items-center`}>
                    <IconButton onClick={()=>setShowMobileMenu(true)} >
                        <CiMenuBurger className={`text-[26px]`}/>
                    </IconButton>
                </div>
            </Container>
        </div>
    )
}

export default Navigation;
