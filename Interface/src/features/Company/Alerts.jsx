import { useContext, useEffect, useState } from "react";
import CompanyNavigation from "../../components/layout/CompanyNavigation";
import Container from "../../components/layout/Container";
import { Breadcrumbs, Link } from "@mui/joy";
import { Badge, Button, CircularProgress, MenuItem } from "@mui/material";
import alertTranslator from "../../lib/alerts";
import { GlobalContext } from "../../contexts/Global";
import AlertCard from "../../components/layout/AlertCard";

function Header({activeTab, setActiveTab, alerts=[]}) {

    const links = [
        {
            link: '/company',
            label: 'Dashboard'
        },
        {
            link: '/company/alerts',
            label: 'Alerts'
        }
    ]
    const brief = "Stay updated with your mission activities and student interactions."
    const tabs = [
        {
            value: 'all',
            label: 'All',
            // badge: 3
        },
        {
            value: 'unread',
            label: 'Unread',
            // badge: 0
        },
    ]

    return (
        <div className={`mt-16 `}>
            <Breadcrumbs className="ps-0!">
                {
                    links.map((link, index)=>(
                        <Link key={link.link} href={link.link} className={`text-gray-500! text-[18px]! ${index === (links.length - 1) ? 'text-black!': 'text-gray-500!'}`}>
                            {link.label}
                        </Link>
                    ))
                }
            </Breadcrumbs>
            <h1 className={`text-[43px] roboto-semibold mt-4`}>Notifications</h1>
            <p className={`roboto text-gray-500`}>{brief}</p>
            <div className={`flex items-center mt-12 gap-4 h-[45px] border-b border-gray-200`}>
                {
                    tabs.map((tab, index)=>(
                        <div key={index} className={`px-5 h-full text-gray-500 roboto flex border-b-2 border-transparent items-center justify-center ${activeTab === tab.value && 'text-blue-main border-blue-main'}`}>
                            {
                                tab.badge ?
                                <Badge sx={{
                                    '& .MuiBadge-badge': {
                                        left: 13
                                    }
                                }} color={activeTab === tab.value ? 'primary': 'secondary'} badgeContent={tab.badge} className={``}>
                                    {tab.label}
                                </Badge>:
                                <>{tab.label}</>
                            }
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

function Content({alerts=[]}) {

    return (
        <div className={`my-7 w-full bg-white rounded-xl border border-gray-100`}>
            {
                alerts.map((alert, index)=>(
                    <AlertCard alert={alert} key={index} last={index === (alerts.length - 1)} />
                ))
            }
            {
                alerts.length === 0 &&
                <div className={`h-[200px] flex items-center justify-center`}>
                    <strong className={`font-normal roboto-semibold text-[19px] text-gray-500`}>No notifications yet.</strong>
                </div>
            }
        </div>
    )
}


function Alerts() {

    const [activeTab, setActiveTab] = useState('all');
    const {mainLoading, alerts, setAlerts} = useContext(GlobalContext);
    useEffect(()=>{
        document.title = 'Company - Alerts'
    }, [])

    useEffect(()=>{
        if (mainLoading)
            return;
        setAlerts(alerts.map((alert)=>(
            {
                ...alert,
                ['new']: false
            }
        )))
    }, [mainLoading])

    return (
        <div className={`min-h-screen bg-gray-50`}>
            <CompanyNavigation/>
            <Container className={`pt-16 md:pt-20`}>
                {
                    mainLoading ?
                    <div className={`h-[200px] flex justify-center items-center`}>
                        <CircularProgress size={21} />
                    </div>:
                    <>
                        <Header alerts={alerts} activeTab={activeTab} setActiveTab={setActiveTab} />
                        <Content alerts={alerts}  />
                    </>
                }
            </Container>
        </div>
    )
}

// const notifications = [
//   {
//     verb_key: "NEW_APPLICATION",
//     context_data: { mission_uuid: "m-101" },
//     is_read: false,
//     created_at: "2025-12-26T09:15:00Z"
//   },
//   {
//     verb_key: "APPLICATION_RESPONSE",
//     context_data: { mission_uuid: "m-101", application_status: "confirmed" },
//     is_read: false,
//     created_at: "2025-12-26T09:30:00Z"
//   },
//   {
//     verb_key: "STUDENT_PROOF_NEEDED",
//     context_data: {},
//     is_read: false,
//     created_at: "2025-12-25T16:00:00Z"
//   },
//   {
//     verb_key: "EMAIL_VALIDATION_NEEDED",
//     context_data: { user_type: "student" },
//     is_read: true,
//     created_at: "2025-12-24T12:00:00Z"
//   },
//   {
//     verb_key: "COMPANY_PROOF_NEEDED",
//     context_data: { company_id: "c-123" },
//     is_read: false,
//     created_at: "2025-12-23T08:45:00Z"
//   },
//   {
//     verb_key: "SECURITY_UPDATED",
//     context_data: { changed_by: "user" },
//     is_read: true,
//     created_at: "2025-12-22T18:20:00Z"
//   },
//   {
//     verb_key: "MISSION_UPDATED",
//     context_data: { mission_uuid: "m-002" },
//     is_read: false,
//     created_at: "2025-12-21T14:05:00Z"
//   },
//   {
//     verb_key: "NEW_APPLICATION",
//     context_data: { mission_uuid: "m-103" },
//     is_read: true,
//     created_at: "2025-12-20T11:11:00Z"
//   },
//   {
//     verb_key: "APPLICATION_RESPONSE",
//     context_data: { mission_uuid: "m-002", application_status: "declined" },
//     is_read: false,
//     created_at: "2025-12-19T07:30:00Z"
//   },
//   {
//     verb_key: "EMAIL_VALIDATION_NEEDED",
//     context_data: { user_type: "company" },
//     is_read: false,
//     created_at: "2025-12-18T22:00:00Z"
//   }
// ];

export default Alerts;
