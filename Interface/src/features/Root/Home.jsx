import Navigation from "../../components/layout/Navigation";
import Footer from "../../components/layout/Footer";
import { Container, Button } from "@mui/material";
import heroman from "../../assets/images/heroman.png";
import { CiCircleCheck, CiHeart } from "react-icons/ci";
import { GoLightBulb } from "react-icons/go";
import { PiShieldThin } from "react-icons/pi";
import { FcStackOfPhotos, FcCommandLine, FcBiomass, FcIdea } from "react-icons/fc";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function HomeHero() {

    const title = "Hire Genius, Find missions, Learn & Earn from Community";
    const brief = "A community where digital students connect and collaborate with companies";
    const navigate = useNavigate();
    return (
        <div className={`md:h-[700px] z-0 bg-gray-50 mt-20`}>
            <Container className={`h-full pt-16 md:pt-0 flex items-start`}>
                <div className={`w-full md:w-[50%] xl:w-[35%] mt-0 md:mt-[50px]`}>
                    {/* <h1 className={`roboto-semibold text-[45px]`}>{title}</h1> */}
                    <h1 className={`roboto-bold text-[35px]`}>Hire <b className={`text-sky`}>Genius,</b></h1>
                    <h1 className={`roboto-bold text-[35px]`}>Find missions,</h1>
                    <h1 className={`roboto-bold text-[35px]`}>Learn & Earn from Community</h1>
                    <p className={`mt-[45px] roboto text-gray-main`}>{brief}</p>
                    <div className={`mt-5 gap-4 flex items-center`}>
                        <Button onClick={()=>navigate('/register')} className={`bg-blue-main roboto-medium text-white! h-[45px] text-[14px]! ps-4! pe-4!`}>
                            Join the community
                        </Button>
                        {/* <Button className={`bg-[#01406c21]! roboto-medium text-[#01406c]! h-[45px] text-[14px]! ps-4! pe-4!`}>
                            Hire Student
                        </Button> */}
                    </div>
                </div>
                <div style={{
                    backgroundImage: `url(${heroman})`,
                }} className={`h-full hidden md:block md:w-[50%] xl:w-[65%] bg-no-repeat bg-contain bg-end`}>
                </div>
            </Container>
        </div>
    )
}

function HomeFeatures() {

    const features = [
        {
            title: 'Development',
            brief: 'Computer science students',
            icon: FcCommandLine
        },
        {
            title: 'Design',
            brief: 'Design students',
            icon: FcStackOfPhotos
        },
        {
            title: 'QA / Testing',
            brief: 'QA students experts',
            icon: FcBiomass
        },
        {
            title: 'Creatives',
            brief: 'Many creatives students',
            icon: FcIdea
        },
    ]

    return (
        <div className={`relative z-10`}>
            <Container>
                <div className={`w-full mt-[100px] md:mt-[-100px] gap-3 xl:h-[200px] bg-white grid grid-cols-12`}>
                    {
                        features.map((feature, index)=>(
                            <div key={index} className={`h-[200px] bg-[#01406c21] mb-3 xl:mb-0 borders-e rounded-3xl border-gray-100 xl:h-full col-span-12 md:col-span-6 xl:col-span-3`}>
                                <div className={`w-full h-full bg-white rounded-3xl shadow-md flex justify-center items-center transition duration-200 ease-in-out hover:translate-x-3 hover:-translate-y-2`}>
                                    <div className={`w-[80%]`}>
                                        <div className={`w-full flex justify-center`}>
                                            <div className={`w-14 h-14 flex items-center rounded-full bg-[#01406c21] justify-center`}>
                                                <feature.icon className={`text-[26px]`}/>
                                            </div>
                                        </div>
                                        <h5 className={`mt-4 ms-0 me-0 roboto-medium text-[19px] text-center`}>{feature.title}</h5>
                                        <p className={`text-gray-main mt-2 text-[15px] roboto text-center`}>{feature.brief}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </Container>
        </div>
    )
}

function HomeMissions() {

    const brief = "At StudentMission, we believe that practical experience is the key to professional success. Our platform connects talented students with innovative companies for assignments that really matter.\
        We democratize access to professional opportunities by removing traditional recruitment barriers and creating an ecosystem where merit and passion prevail.\
        Each assignment is an opportunity to learn, grow, and build a solid professional future."
    const illustration = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop";
    return (
        <div className={`mt-[100px] xl:h-[400px] bg-white`}>
            <Container className={`grid grid-cols-2 gap-3`}>
                <div className={`col-span-2 xl:col-span-1`}>
                    <h3 className={`roboto-medium text-[33px]`}>Our mission</h3>
                    <p className={`mt-3 text-[19px] roboto-light`}>{brief}</p>
                </div>
                <div className={`col-span-2 xl:col-span-1 flex justify-end`}>
                    <img src={illustration} alt="Illustration" className={`w-[90%] rounded-3xl`}/>
                </div>
            </Container>
        </div>
    )
}

function HomeValues() {

    const brief = "The principles that guides our daily actions";
    const values = [
        {
            title: "Success",
            brief: "We strive for excellence in every interaction between students and companies.",
            icon: CiCircleCheck
        },
        {
            title: "Kindness",
            brief: "An environment of trust and mutual respect for all our users.",
            icon: CiHeart
        },
        {
            title: "Innovation",
            brief: "We are constantly innovating to improve the experience of our community.",
            icon: GoLightBulb
        },
        {
            title: "Transparency",
            brief: "Transparent and fair relationships between all platform participants.",
            icon: PiShieldThin
        },
    ]
    return (
        <div className={`mt-[100px] mb-5`}>
            <Container className={``}>
                <h3 className={`roboto-medium text-center text-[39px]`}>Our values</h3>
                <p className={`mt-4 roboto text-[23px] text-center`}>{brief}</p>
                <div className={`grid grid-cols-12 gap-3 mt-20`}>
                    {
                        values.map((value, index)=>(
                            <div key={index} className={`h-[260px] group bg-[#01406c21] rounded-2xl  cursor-pointer transition-all duration-200 ease-in-out border border-transparent hover:border-gray-200 hover:-translate-y-1 shadow-md p-3 col-span-12 md:col-span-6 xl:col-span-3`} >
                                <div className={`w-full flex justify-center`}>
                                    <div className={`w-[60px] bg-[#00aabc21] h-[60px] group-hover:bg-[#00aabc] transition duration-200 ease-in-out rounded-full flex items-center justify-center`}>
                                        <value.icon className={`text-sky transition duration-200 ease-in-out group-hover:text-white! text-[29px]`}/>
                                    </div>
                                </div>
                                <h5 className={`mt-4 roboto-medium text-[17px] text-center`}>{value.title}</h5>
                                <p className={`text-center m-2 mt-5 roboto-light`}>{value.brief}</p>
                            </div>
                        ))
                    }
                </div>
            </Container>
        </div>
    )
}


function Home() {

    useEffect(()=>{
        document.title = "Home - STM"
        window.scrollTo({top: 0, behavior: 'smooth'})
    }, [])
    return (
        <div>
            <Navigation current="home" />
            <HomeHero/>
            <HomeFeatures/>
            <HomeMissions/>
            <HomeValues/>
            <Footer/>
        </div>
    )
}

export default Home;
