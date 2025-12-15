import { Button, Container, IconButton } from "@mui/material";
import StudentNavigation from "../../components/layout/StudentNavigation";
import { Input, Chip } from "@mui/joy";
import { GoSearch } from "react-icons/go";
import { useEffect, useState } from "react";
import { FaBookmark } from "react-icons/fa";

// Components
const MissionCard = ({mission})=>{

    const levelsTheme = {
        Rookie: 'bg-amber-700/30! text-amber-700!',
        Apprentice: 'bg-amber-500/30! text-amber-500!',
        Intermediate: 'bg-blue-700/30! text-blue-700!',
        Challenger: 'bg-blue-500/30! text-blue-500!',
        Expert: 'bg-[#02616b30]! text-[#02616b]!',
        Master: 'bg-[#00aabc30]! text-[#00aabc]!',
        Senior: 'bg-[#03d69330]! text-[#03d693]!'
    }

    return (
        <div className={`p-4 rounded-2xl select-none shadow-2xs bg-white mb-5 border-2 border-gray-100 py-5 gap-3 2xl:gap-8 flex items-start`}>
            <div style={{
                backgroundImage: `url(${mission.company.picture})`
            }} className={`w-[130px] h-[110px] bg-center rounded-xl bg-no-repeat bg-cover`}>
            </div>
            <div className={``}>
                <h6 className={`roboto-light text-[15px] text-gray-main`}>{mission.company.name}</h6>
                <h3 className={`roboto-medium text-[21px]`}>{mission.name}</h3>
                <p className={`text-[15px] roboto-light text-gray-main wrap-break-word line-clamp-1`}>{mission.description}</p>
                <Chip className={`roboto ${levelsTheme[mission.level]}`}>
                    {mission.level}
                </Chip>
            </div>
            <div className={`flex-1`}>
                <div className={`flex justify-end`}>
                    <Button sx={{
                        textTransform: 'none'
                    }} className={`w-[90px] xl:w-[120px] h-10 text-white! bg-blue-500! roboto-medium`}>
                        Apply
                    </Button>
                </div>
                <div className={`flex justify-end mt-2`}>
                    <div className={`w-[90px] xl:w-[120px] flex justify-center`}>
                        <IconButton>
                            <FaBookmark className={`text-gray-main text-[20px]`}/>
                        </IconButton>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Main
function Content({data}) {

    const splitToPages = (sizePerPage=5)=>{
        let pages = [];
        let pageTmp = [];
        for (const mission of data.missions) {
            pageTmp.push(mission);
            if (pageTmp.length === sizePerPage) {
                pages.push(pageTmp);
                pageTmp = [];
            }
        }
        if (pageTmp.length > 0) {
            pages.push(pageTmp);
        }
        return pages;
    }
    const [activePage, setActivePage] = useState(1);
    const [missionPages, setMissionsPages] = useState(splitToPages(3));


    useEffect(()=>{
        setMissionsPages(splitToPages(3));
    }, [data.missions])
    // Effects

    return (
        <div className={`pt-[130px] pb-10`}>
            <div className={`w-full`}>
                <h1 className={`text-[33px] roboto-medium`}>Find Your Next Mission</h1>
                <p className={`roboto-light text-gray-main text-[16px]`}>Showing 200 missions</p>
            </div>
            <div className={`my-8 gap-4 flex items-center`}>
                <Input
                    startDecorator={
                        <IconButton>
                            <GoSearch className={`text-[19px]`}/>
                        </IconButton>
                    }
                    className={`w-[130px] xl:w-[500px] h-[45px]`}
                    placeholder="Research something"
                />
            </div>
            <div className={`mt-5 pb-5 border-b border-gray-200`}>
                {
                    missionPages.length > 0 && missionPages[activePage - 1].map((mission, index)=>(
                        <MissionCard mission={mission} key={index} />
                    ))
                }
            </div>
            <div className={`mt-4 flex items-center justify-between`}>
                <div className={`w-[50%]`}>

                </div>
                <div className={`flex justify-end gap-4 items-center`}>
                    {
                        activePage > 1 &&
                        <Button onClick={()=>{
                            setActivePage(activePage - 1);
                            window.scrollTo({top: 0, behavior: 'smooth'})
                        }} sx={{
                            textTransform: 'none'
                        }} className={`bg-white! text-[16px]! px-6! text-black! roboto border! border-gray-200!`}>
                            Previous
                        </Button>
                    }
                    {
                        missionPages.length > 0 && activePage < missionPages.length &&
                        <Button onClick={()=>{
                            setActivePage(activePage + 1);
                            window.scrollTo({top: 0, behavior: 'smooth'})
                        }} sx={{
                            textTransform: 'none'
                        }} className={`bg-white! text-[16px]! px-6! text-black! roboto border! border-gray-200!`}>
                            Next
                        </Button>
                    }
                </div>
            </div>
        </div>
    )
}

function FindMissions() {

    useEffect(()=>{
        document.title = "Find missions | STM"
    }, [])

    const [data, setData] = useState({
        missions: [
            {
            name: "Landing Page Redesign",
            description: "Redesign the marketing landing page to improve conversion and accessibility. aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            level: "Apprentice",
            company: { name: "BlueTech", picture: "https://picsum.photos/seed/blueTech/80/80" }
            },
            {
            name: "Payments API Integration",
            description: "Integrate a payments provider and implement secure webhooks.",
            level: "Intermediate",
            company: { name: "PayFlux", picture: "https://ui-avatars.com/api/?name=PayFlux&background=ffdd57&color=000&size=80" }
            },
            {
            name: "Mobile Prototype (React Native)",
            description: "Build a cross-platform prototype for onboarding flows.",
            level: "Challenger",
            company: { name: "Novala", picture: "https://picsum.photos/seed/novala/80/80" }
            },
            {
            name: "Performance Optimization",
            description: "Audit and improve core web vitals (LCP, TTI).",
            level: "Expert",
            company: { name: "OptiWeb", picture: "https://i.pravatar.cc/80?img=24" }
            },
            {
            name: "CI/CD Pipeline Setup",
            description: "Create a CI/CD workflow with tests and rollback.",
            level: "Master",
            company: { name: "Deployly", picture: "https://picsum.photos/seed/deployly/80/80" }
            },
            {
            name: "Data Pipeline & Reporting",
            description: "Design ETL pipeline and provide analytics dashboards.",
            level: "Intermediate",
            company: { name: "DataWorks", picture: "https://ui-avatars.com/api/?name=DataWorks&background=00aabc&color=fff&size=80" }
            },
            {
            name: "Accessibility Audit",
            description: "Perform WCAG AA accessibility audit and fixes.",
            level: "Rookie",
            company: { name: "A11yLab", picture: "https://picsum.photos/seed/a11ylab/80/80" }
            },
            {
            name: "User Notifications",
            description: "Implement in-app and email notifications with preferences.",
            level: "Apprentice",
            company: { name: "NotifyPro", picture: "https://i.pravatar.cc/80?img=32" }
            },
            {
            name: "Refactor Monolith to Services",
            description: "Refactor a legacy module into a service with tests.",
            level: "Senior",
            company: { name: "MicroShift", picture: "https://picsum.photos/seed/microshift/80/80" }
            },
            {
            name: "Design System Components",
            description: "Create reusable UI components and Storybook stories.",
            level: "Intermediate",
            company: { name: "StudioUI", picture: "https://ui-avatars.com/api/?name=StudioUI&background=01406c&color=fff&size=80" }
            }
        ]
    })

    return (
        <div className={`bg-gray-100 min-h-screen`}>
            <StudentNavigation/>
            <Container>
                <Content data={data} />
            </Container>
        </div>
    )
}

export default FindMissions;
