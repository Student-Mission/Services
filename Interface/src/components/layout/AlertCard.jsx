import { useRef, useState } from "react";
import { MenuItem, Button } from "@mui/material";
import alertTranslator from "../../lib/alerts";
import { Link, useNavigate } from "react-router-dom";

const AlertCard = ({alert, last=false})=>{

    const [focused, setFocused] = useState(false);
    const alertData = alertTranslator[alert.verb_key](alert);
    const navigate = useNavigate();
    const buttonRef = useRef(null);

    const handleClick = (e)=>{
        if (buttonRef.current && buttonRef.current.contains(e.target)) {
            return;
        }
        setFocused(!focused);
    }
    return (
        <div onClick={()=>{
            handleClick();
        }} className={`px-4! p-3! w-full! border-s-2! block! border-s-transparent! transition-transform select-none h-[95px]! ${alert.is_read && 'border-s-blue-500! bg-slate-50!'} ${!last && 'border-b! border-b-gray-100!'} ${focused && 'h-[130px]!'}`}>
        {/* <div className={`px-4 p-3 w-full border-s-2 border-s-transparent select-none flex items-center h-[95px] gap-5 ${alert.is_read && 'border-s-blue-500 bg-slate-50'} ${focused && ''} ${!last && 'border-b border-gray-100'}`}> */}
            <div className={`flex items-center gap-5 w-full h-full ${focused && 'h-auto!'}`}>
                <div className={`h-[45px] w-[45px] flex justify-center items-center rounded-full border ${alertData.style.class}`}>
                    <alertData.style.icon className={``}/>
                </div>
                <div className={`max-w-[55%]`}>
                    <h4 className={`roboto-medium text-[18px]`}>{alertData.title}</h4>
                    <p className={`roboto text-[14px] text-gray-500 ${focused ? '': 'line-clamp-1! text-ellipsis'}`}>{alertData.message}</p>
                </div>
            </div>
            {
                focused && alertData.link &&
                <div className="flex justify-end max-w- mt-3">
                    <Link ref={buttonRef} to={alertData.link}>
                        <Button onClick={()=>{
                            navigate(alertData.link)
                        }} sx={{
                            textTransform: 'none'
                        }} className="bg-blue-main text-[14px]! text-white! roboto">
                            {alertData.linkText}
                        </Button>
                    </Link>
                </div>
            }

        {/* </div> */}
        </div>
    )
}

export default AlertCard;
