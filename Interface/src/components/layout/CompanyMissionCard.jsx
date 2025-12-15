import { Chip } from "@mui/material";
import { Link } from "react-router-dom";

function CompanyMissionCard({mission}) {

    const skills = mission.role.skills.filter((v,i)=>i < 3)

    return (
        <div className={`w-full h-[280px] cursor-pointer transition-colors duration-200 ease-in-out hover:bg-gray-50 rounded-2xl p-4 select-none shadow-2xs border border-gray-200`}>
            <Link to={`/company/missions/${mission.uuid}`}>
                <h4 className={`text-[17px] text-blue-focus roboto`} >{mission.name}</h4>
                <p className={`mt-2 h-[50px] roboto-light wrap-break-word line-clamp-2 `}>{mission.description}</p>
                <div style={{
                    backgroundImage: `url(${mission.picture})`
                }} className={`h-[100px] mt-5  bg-center bg-cover bg-no-repeat rounded-xl`}>
                </div>
                <div className={`mt-3 gap-2 flex flex-wrap`}>
                    {
                        skills.map((skill, index)=>(
                            <Chip key={index} label={skill} className="text-[10px]! roboto bg-[#01406c21]! text-blue-main" />
                        ))
                    }
                </div>
            </Link>
        </div>
    )
}

export default CompanyMissionCard;
