import { useEffect } from "react";
import Navigation from "../../components/layout/Navigation";
import { Container } from "@mui/material";
import { FcPositiveDynamic } from "react-icons/fc";
import premium from "../../assets/images/premium.png";
import prix from "../../assets/images/prix.png";
import progress from "../../assets/images/progress.png";
import fst_student from "../../assets/images/student1.jpg";
import sec_student from "../../assets/images/startup.jpg";
import Footer from "../../components/layout/Footer";

function StudentFeatures() {

    const title = "An Entire suite of missions at your FingerTips";

    const features = [
        {
            title: 'Growth in skills',
            brief: 'An opportunity to develop skills',
            icon: progress
        },
        {
            title: 'Certify skills',
            brief: "Certify your skills by doing companies missions",
            icon: prix
        },
        {
            title: 'Premium tasks',
            brief: 'Get paid by doing premium missions',
            icon: premium
        }
    ]

    return (
        <div className="mt-40! w-full">
            <Container className="grid grid-cols-12 gap-3">
                <div className={`col-span-12 lg:col-span-6`}>
                    <h3 className={`mb-10 text-[25px] md:text-[33px] roboto-semibold`}>{title}</h3>
                    {
                        features.map((feature, index)=>(
                            <div key={index} className={`flex gap-3 mb-5 items-center`}>
                                <div className={`shadow-lg p-2 rounded-full`}>
                                    <img src={feature.icon} alt={feature.title} className={`w-7 h-7`} />
                                </div>
                                <div className={``}>
                                    <h5 className={`text-[18px] roboto-medium`}>{feature.title}</h5>
                                    <p className={`roboto-light`}>{feature.brief}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className={`col-span-12 flex lg:col-span-6 gap-4`}>
                    <img src={fst_student} alt="student 1" className={`w-full rounded-3xl`} />
                </div>
            </Container>
        </div>
    )
}

function StudentMission() {
    
    const title = "Increase your skills, and your opportunities";
    const description = "Participate in real-world missions offered by partner companies to gain hands-on experience, validate your skills, and build your portfolio. Missions are designed to be educational, sometimes paid, and include professional feedback.";
    return (
        <div className={`mt-20 pt-20 pb-20 w-full bg-gray-100`}>
            <Container className={`grid grid-cols-12 gap-5`}>
                <div className={`col-span-12 lg:col-span-6`}>
                    <img src={sec_student} alt="student 2" className={`w-full rounded-3xl`} />
                </div>
                <div className={`col-span-12 lg:col-span-6`}>
                    <h3 className={`text-[35px] roboto-semibold`}>{title}</h3>
                    <p className={`text-[21px] mt-5 roboto-light text-justify`}>{description}</p>
                </div>
            </Container>
        </div>
    )
}

function Content() {

    const title = "Connecting tomorrow's talent with today's businesses";
    const brief = "StudentMission is revolutionizing the way students access the professional world by creating direct links with companies for practical, educational assignments.";

    return (
        <div className={`mt-16 md:mt-20`}>
            <div className={`h-[300px] bg-[#01406c07]`}>
                <Container className={`pt-12`}>
                    <h1 className={`text-[35px] text-center roboto-semibold ms-20 me-20 mt-10`} >{title}</h1>
                    <p className={`mt-5 roboto-light text-center text-[15px]`}>{brief}</p>
                </Container>
            </div>

            <StudentFeatures/>
            <StudentMission/>
        </div>
    )
}

function StudentPanel() {

    useEffect(()=>{
        document.title = 'Student - STM'
        window.scrollTo({top: 0, behavior: 'smooth'})
    }, [])
    return (
        <div>
            <Navigation current="for-students" />
            <Content/>
            <Footer/>
        </div>
    )
}

export default StudentPanel;
