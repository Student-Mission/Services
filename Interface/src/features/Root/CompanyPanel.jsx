import { useEffect } from "react";
import Navigation from "../../components/layout/Navigation"
import Footer from "../../components/layout/Footer";
import { Container, Button } from "@mui/material";
import map from "../../assets/images/map2.png";

function CompanyFeatures() {

    const features = [
        {
            title: "Offer missions challenges",
            brief: "Post practical, project-based challenges that reflect real business needs. Define clear goals and deliverables so students can showcase applied skills."

        },
        {
            title: "Recruit talents",
            brief: "Access a curated pool of vetted students and recent graduates to quickly shortlist, interview, and hire interns or freelance contributors."

        },
        {
            title: "Give feedback",
            brief: "Provide structured, actionable feedback to help students improve and better match your future needs while strengthening their portfolios."

        }
    ]
    return (
        <div className="pt-10 mt-18 pb-10">
            <Container className={`grid grid-cols-12 gap-4`}>
                {
                    features.map((feature, index)=>(
                        <div key={index} className={`col-span-12 md:col-span-6 xl:col-span-4`}>
                            <div className={`w-10 h-10 roboto-bold text-[20px] rounded-full text-white bg-blue-main flex items-center justify-center`}>
                                {index + 1}
                            </div>
                            <div className={`mt-5`}>
                                <h5 className={`roboto-medium text-[21px]`}>{feature.title}</h5>
                                <p className={`mt-3 roboto-light`}>{feature.brief}</p>
                            </div>
                        </div>
                    ))
                }
            </Container>
        </div>
    )
}

function Content() {

    const title = "Explore our talents network";
    const brief = "Discover vetted student talent ready to support your projects — hire interns, freelancers, or collaborate on mission-based work to accelerate product delivery and innovation.";
    return (
        <div className="mt-16 md:mt-20">
            <div className={`h-[300px] bg-[#01406c07]`}>
                <Container className={`pt-12`}>
                    <h1 className={`text-[35px] mt-10 ms-20 me-20 text-center roboto-semibold`} >{title}</h1>
                    <p className={`mt-5 roboto-light text-center text-[14px]`}>{brief}</p>
                </Container>
            </div>
            <CompanyFeatures/>
            <Container>
                <div style={{
                    backgroundImage: `url(${map})`
                }} className="mt-18 lg:h-[700px] bg-center bg-no-repeat bg-cover">

                </div>
                <div className="flex items-center justify-center">
                    <Button className="bg-blue-main roboto text-white! h-[45px]">
                        Join the community
                    </Button>
                </div>
            </Container>
        </div>
    )
}


function CompanyPanel() {

    useEffect(()=>{
        document.title = "Company - STM";
        window.scrollTo({top: 0, behavior: 'smooth'})
    }, [])

    return (
        <div>
            <Navigation current="for-companies" />
            <Content/>
            <Footer/>
        </div>
    )
}

export default CompanyPanel;
