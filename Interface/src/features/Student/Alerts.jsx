import { useContext, useEffect } from "react";
import StudentNavigation from "../../components/layout/StudentNavigation";
import { CircularProgress, Container } from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import AlertCard from "../../components/layout/AlertCard";
import { GlobalContext } from "../../contexts/Global";

dayjs.extend(relativeTime);

// const alerts = [
//   {
//     title: "New mission available",
//     content: "A new Frontend Apprenticeship mission has been posted that matches your skills.",
//     created_at: "2025-12-10T11:55:00Z" // ~5 minutes ago
//   },
//   {
//     title: "Application accepted",
//     content: "Your application for 'Landing Page Redesign' was accepted by BlueTech.",
//     created_at: "2025-12-10T10:00:00Z" // ~2 hours ago
//   },
//   {
//     title: "Feedback received",
//     content: "You received feedback on your recent submission — check the mission details.",
//     created_at: "2025-12-09T12:00:00Z" // ~1 day ago
//   },
//   {
//     title: "Reminder: deadline approaching",
//     content: "The deadline for 'Payments API Integration' is in 3 days. Submit your work.",
//     created_at: "2025-12-07T12:00:00Z" // ~3 days ago
//   },
//   {
//     title: "New company followed",
//     content: "You started following OptiWeb — we'll show you relevant missions.",
//     created_at: "2025-12-03T12:00:00Z" // ~1 week ago
//   },
//   {
//     title: "Platform update",
//     content: "We deployed a minor update to mission search and filters.",
//     created_at: "2025-11-26T12:00:00Z" // ~2 weeks ago
//   },
//   {
//     title: "Payment processed",
//     content: "Your payout for the completed mission has been processed.",
//     created_at: "2025-11-10T12:00:00Z" // ~1 month ago
//   },
//   {
//     title: "Account tip",
//     content: "Complete your profile to increase your chances of being selected.",
//     created_at: "2025-09-10T12:00:00Z" // ~3 months ago
//   },
//   {
//     title: "Policy update",
//     content: "We've updated our terms of service — please review the changes.",
//     created_at: "2025-06-10T12:00:00Z" // ~6 months ago
//   },
//   {
//     title: "Welcome back",
//     content: "It's been a while! New missions are waiting for you.",
//     created_at: "2024-12-10T12:00:00Z" // ~1 year ago
//   }
// ];

function Content({alerts=[]}) {

    return (
        <div className={`pt-[100px] lg:pt-[130px] pb-12`}>
            <div className={`flex items-center justify-between`}>
                <h1 className={`roboto-medium text-[37px]`}>Alerts</h1>
                {
                  alerts.length > 0 &&
                  <span className={`text-blue-main text-[16px] roboto select-none cursor-pointer hover:underline`}>Make all as read</span>
                }
            </div>
            <div className={`mt-5`}>
                {
                    alerts.map((alert, index)=>(
                      <AlertCard key={index} alert={alert} />
                        // <div key={index} className={`mb-3 shadow-2xs border border-gray-300 bg-white rounded-3xl px-5 py-5 min-h-[100px]`}>
                        //     <h4 className={`text-[20px] roboto-medium text-blue-focus`}>{notif.title}</h4>
                        //     <p className={`line-clamp-1 roboto-light text-[17px] text-blue-main`}>{notif.content}</p>
                        //     <p className={`roboto-light text-gray-500 text-[15px] mt-2`}>{dayjs(notif.created_at).from()}</p>
                        // </div>
                    ))
                }
                {
                  alerts.length === 0 &&
                  <div className={`w-full h-[200px] flex justify-center items-center`}>
                    <strong className={`font-normal roboto-semibold text-[19px] text-gray-500`}>No alerts yet.</strong>
                  </div>
                }
            </div>
        </div>
    )
}

function Alerts() {

    useEffect(()=>{
        document.title = "Student Alerts | STM";
    }, [])
    const {mainLoading, alerts, setAlerts} = useContext(GlobalContext);

    useEffect(()=>{
      if (mainLoading)
        return;
      setAlerts(alerts.map((alert)=>(
        {...alert, ['new']: false}
      )))
    }, [mainLoading])

    return (
        <div className={`min-h-screen bg-gray-100`}>
            <StudentNavigation/>
            <Container>
              {
                mainLoading ?
                <div className={`w-full h-[200px] flex justify-center items-center`}>
                  <CircularProgress size={22} />
                </div>:
                <>
                  <Content alerts={alerts} />
                </>
              }
            </Container>
        </div>
    )
}

export default Alerts;
