import { useContext, useEffect, useState } from "react";
import CompanyNavigation from "../../components/layout/CompanyNavigation";
import Container from "../../components/layout/Container";
import { Button, CircularProgress } from "@mui/material";
import CompanyMissionCard from "../../components/layout/CompanyMissionCard";
import MissionFilterModal from "../../components/layout/MissionFilterModal";
import Connection from "../../services/Connection";
import { GlobalContext } from "../../contexts/Global";
import { useNavigate } from "react-router-dom";

function Content({missions=[], loading}) {

    const [showFilter, setShowFilter] = useState(false);
    

    return (
        <div className={`mt-20`}>
            <div className={`flex items-center`}>
                <Button onClick={()=>setShowFilter(true)} sx={{
                    textTransform: 'none'
                }} className={`bg-[#c9c9c9]! text-gray-main roboto`}>
                    Filter
                </Button>
            </div>
            <MissionFilterModal show={showFilter} onHide={()=>setShowFilter(false)} />
            
            {
                loading ?
                <div className="mt-5 flex items-center justify-center">
                    <CircularProgress size={20} sx={{
                        color: '#01406c'
                    }} />
                </div>:
                <div className={`mt-10 grid grid-cols-12 gap-4`}>
                    {
                        missions.map((mission, index)=>(
                            <div key={index} className={`col-span-12 md:col-span-4 xl:col-span-3`}>
                                <CompanyMissionCard mission={mission} />
                            </div>
                        ))
                    }
                </div>
            }
        </div>
    )
}

function Missions() {

    useEffect(()=>{
        document.title = "Missions - STM";
        window.scrollTo({top: 0, behavior: 'smooth'});
        fetchMissions();
    }, [])

    const {setLogged} = useContext(GlobalContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const fetchMissions = ()=>{
        Connection.get('business/missions/', (data)=>{
            setMissions(data.missions);
        }, (error)=>{
            if (error.response) {
                if (error.response.status === 401) {
                    setLogged(false);
                    navigate('/login');
                }
            } else {
                alert('Network error');
            }
        }, setLoading, true);
    }

    const [missions, setMissions] = useState([]);

    // const missions = [
    //     {
    //         uuid: 'cGjsio',
    //         name: 'Landing Page Redesign',
    //         description: 'Redesign and implement a responsive landing page to improve conversion and accessibility. Deliver Figma mockups and a production-ready React component set.',
    //         role: {
    //             title: 'Frontend Developer',
    //             skills: ['React', 'HTML/CSS', 'Responsive Design', 'A11y', 'Figma']
    //         }
    //     },
    //     {
    //         uuid: 'mlkoGiu',
    //         name: 'API Integration for Payments',
    //         description: 'Integrate a payments provider (Stripe or equivalent) into the existing backend, implement server-side webhooks and secure client checkout flow.',
    //         role: {
    //             title: 'Full-stack Developer',
    //             skills: ['Node.js', 'Express', 'Stripe API', 'Security', 'Postgres']
    //         }
    //     },
    //     {
    //         uuid: 'xshagW',
    //         name: 'Performance Optimization',
    //         description: 'Audit web app performance, identify bottlenecks and implement improvements (code-splitting, lazy loading, image optimization) to reduce TTI and LCP.',
    //         role: {
    //             title: 'Web Performance Engineer',
    //             skills: ['React', 'Webpack', 'Lighthouse', 'Image Optimization', 'Caching']
    //         }
    //     },
    //     {
    //         uuid: 'wHysat',
    //         name: 'Mobile App Prototype',
    //         description: 'Build a cross-platform mobile prototype for an existing feature set using React Native or Flutter, including authentication and offline support.',
    //         role: {
    //             title: 'Mobile Developer',
    //             skills: ['Flutter', 'OAuth', 'Local Storage', 'API Integration', 'Testing']
    //         }
    //     },
    //     {
    //         uuid: 'tYsgza',
    //         name: 'Data Pipeline & Reporting',
    //         description: 'Design and implement a simple ETL pipeline to aggregate usage events into analytics tables and provide a dashboard with key metrics.',
    //         role: {
    //             title: 'Data Engineer',
    //             skills: ['Python', 'ETL', 'Airflow', 'SQL', 'Data Visualization']
    //         }
    //     },
    //     {
    //         uuid: 'hshyUj',
    //         name: 'CI/CD Pipeline Setup',
    //         description: 'Create a CI/CD workflow for the project (build, test, lint, deploy to staging) using GitHub Actions (or equivalent) with rollback strategy.',
    //         role: {
    //             title: 'DevOps Engineer',
    //             skills: ['GitHub Actions', 'Docker', 'Kubernetes', 'Testing', 'Monitoring']
    //         }
    //     }
    // ]

    return (
        <div>
            <CompanyNavigation current="missions" />
            <Container className="mt-16 md:mt-20">
                <Content missions={missions} loading={loading} />
            </Container>
        </div>
    )
}

export default Missions;
