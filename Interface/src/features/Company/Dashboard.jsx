import { useEffect, useState } from "react";
import CompanyNavigation from "../../components/layout/CompanyNavigation";
import Container from "../../components/layout/Container";
import { BiSolidOffer } from "react-icons/bi";
import { HiQueueList, HiMiniSquare3Stack3D } from "react-icons/hi2";
import { PiBagSimpleFill } from "react-icons/pi";
import { LineChart, lineElementClasses, markElementClasses, PieChart } from "@mui/x-charts";
import { Box, Button, CircularProgress } from "@mui/material";
import { LiaEbay } from "react-icons/lia";
import { Chip } from "@mui/joy";
import { CiCircleCheck } from "react-icons/ci";
import { FaCirclePlus } from "react-icons/fa6";
import { GoPlus } from "react-icons/go";
import Connection from "../../services/Connection";
import { useNavigate } from "react-router-dom";
import { requestFailureHandler } from "../../lib/utils";
const MEDIA_API = import.meta.env.VITE_MEDIA_API;

const StatusCard = ({data})=>{

    // const data = {
    //     status: 'free',
    //     picture: 'https://picsum.photos/seed/blueTech/80/80',
    //     verified: true,
    // }

    const statusLabels = {
        free: 'Free',
        premium: "Premium"
    }


    return (
        <div className={`min-h-[200px] bg-white shadow-md mt-5 border border-gray-200 rounded-xl p-3 md:p-4 grid grid-cols-12`}>
            <div className={`col-span-12 md:col-span-6`}>
                <div className={`flex gap-3 items-center`}>
                    <h5 className={`roboto-light text-gray-main text-[16px]`}>Your Status</h5>
                    <Chip variant='outlined' sx={{
                        borderColor: '#02616b',
                        color: '#02616b',
                        fontFamily: 'Roboto'
                    }}>
                        {statusLabels[data.status]}
                    </Chip>
                </div>
                <div className={`mt-5`}>
                    <div className={`flex items-center gap-2 border px-3 rounded-full text-[15px] w-44 py-2 roboto border-sky text-sky`}>
                        <CiCircleCheck className={`text-[22px] text-sky`}/>
                        Trusted Company
                    </div>
                    <Button sx={{
                        textTransform: "none"
                    }} className={`text-sky-dark h-[38px] roboto bg-[#02616b21]! mt-3!`}>
                        Upgrade
                    </Button>
                </div>
                
            </div>
            <div className={`col-span-12 md:col-span-6`}>
                <div className={`w-full h-full flex items-center justify-end`}>
                    <div style={{
                        backgroundImage: `url('${MEDIA_API}${data.picture}')`
                    }} className={`bg-cover bg-center bg-no-repeat w-full md:w-[90%] xl:w-[40%] rounded-xl h-[200px] md:h-[180px]`}>
                    </div>
                </div>
            </div>
        </div>
    )
}

const NewProjectCard = ()=>{

    const navigate = useNavigate();

    const brief = "Start by posting your first mission to attract talented students. Click the button below to get started.";
    return (
        <div className={`w-full bg-white rounded-2xl border border-gray-400 border-dashed h-[280px] my-5 flex items-center justify-center`}>
            <div className="w-full md:w-[50%]">
                <div className={`flex justify-center`}>
                    <FaCirclePlus className={`text-gray-400 text-[40px]`}/>
                </div>
                <h4 className={`roboto-semibold mt-2 text-[22px] text-center`}>No missions posted yet?</h4>
                <div className={`flex items-center justify-center`}>
                    <p className={`text-center mt-2 roboto-light text-gray-main text-[19px]`}>
                        {brief}
                    </p>
                </div>
                <div className="flex justify-center">
                    <Button sx={{
                        textTransform: 'none'
                    }} onClick={()=>navigate("/company/new-mission")} className={`bg-blue-main h-[38px] roboto mt-3! text-white!`}>
                        <GoPlus className={`text-[17px]`}/>
                        Post your First Mission
                    </Button>
                </div>

            </div>
        </div>
    )
}

function Content({data}) {

    const headerStats = [
        {
            title: 'Active offers',
            value: data.header.active_missions,
            icon: BiSolidOffer
        },
        {
            title: 'Waiting applications',
            value: data.header.waiting_applications,
            icon: HiQueueList
        },
        {
            title: 'Students hired',
            value: data.header.students_hired,
            icon: PiBagSimpleFill
        },
        {
            title: 'All missions',
            value: data.header.all_missions,
            icon: HiMiniSquare3Stack3D
        }
    ]

    const lineChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const lineChartData = data.stats.missions_per_month;

    let appRate = data.stats.applications_rate;
    const applicationsRate = [
        {
            label: 'Accepted',
            value: appRate.confirmed,
        },
        {
            label: 'Declined',
            value: appRate.declined
        },
        {
            label: 'Waiting for approval',
            value: appRate.pending
        },
        appRate.pending === 0 && appRate.confirmed === 0 && appRate.declined === 0 &&
        {
            label: 'No Data',
            value: 10
        }
    ]



    return (
        <div className="h-[500px] pt-16">
            <div className={`w-full gap-3 xl:gap-6 grid grid-cols-12`}>
                {
                    headerStats.map((stat, index)=>(
                        <div key={index} className={`col-span-12 md:col-span-6 lg:col-span-3 h-[120px] p-3 rounded-xl bg-[#01406c11]`} >
                            <div className={`flex items-center justify-between`}>
                                <h3 className={`roboto text-xl text-blue-focus`}>{stat.title}</h3>
                                <stat.icon className={`text-[23px] text-sky`}/>
                            </div>
                            <h5 className={`mt-5 text-3xl roboto text-blue-main`}>{stat.value}</h5>
                        </div>
                    ))
                }
            </div>
            <StatusCard data={data.profile} />
            
            {
                data.header.all_missions > 0 ?
                <div className={`mt-5 grid grid-cols-12 gap-4`}>
                    <div className={`p-3 col-span-12 lg:col-span-6 xl:col-span-8 xl:h-[400px] rounded-2xl shadow border border-gray-200`}>
                        <div className={`flex items-center justify-between`}>
                            <h5 className={`roboto text-[19px]`}>Monthly missions published</h5>
                            <Button sx={{
                                textTransform: 'none'
                            }} className={`bg-blue-main text-white! roboto-medium`}>
                                Export
                            </Button>
                        </div>
                        <Box sx={{
                            width: '100%',
                            height: '91%'
                        }}>
                            <LineChart
                                grid={{
                                    horizontal: true,
                                    vertical: true
                                }}
                                series={[
                                    {data: lineChartData, label: 'Month application', id: 'mID'}
                                ]}
                                xAxis={[
                                    {scaleType: 'point', data: lineChartLabels}
                                ]}
                                yAxis={[
                                    {width: 30}
                                ]}

                                sx={{
                                    
                                    [`.${lineElementClasses.root}, .${markElementClasses.root}`]: {
                                        strokeWidth: 1,
                                    },
                                    [`.${lineElementClasses.root}[data-series="mID"]`]: {
                                        strokeDasharray: '5 5',
                                    },
                                    // [`.${lineElementClasses.root}[data-series="uvId"]`]: {
                                    //     strokeDasharray: '3 4 5 2',
                                    // },
                                    [`.${markElementClasses.root}:not(.${markElementClasses.highlighted})`]: {
                                        fill: '#fff',
                                    },
                                    [`& .${markElementClasses.highlighted}`]: {
                                        strokeWidth: 1
                                    },
                                }}
                            />
                        </Box>
                    </div>
                    <div className={`p-3 col-span-12 lg:col-span-6 xl:col-span-4 xl:h-[400px] rounded-2xl shadow border border-gray-200`}>
                        <div className={`flex items-center justify-between`}>
                            <h5 className={`text-[19px] roboto`}>Applications rate</h5>
                            <Button sx={{
                                textTransform: 'none'
                            }} className={`bg-blue-main roboto-medium text-white!`}>
                                Export
                            </Button>
                        </div>
                        <Box sx={{
                            width: '100%',
                            // border: '1px solid',
                            height: '88%',
                            mt: 2
                        }}>
                            <PieChart
                                series={[
                                    {
                                        data: applicationsRate.map((app, index)=>(
                                            {id: index, value: app.value, label: app.label}
                                        ))
                                    }
                                ]}
                                width={200}
                            />
                        </Box>
                    </div>
                </div>:
                <NewProjectCard/>
            }

        </div>
    )
}

function Dashboard() {

    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [requestError, setRequestError] = useState(null);
    const navigate = useNavigate();

    // Handlers
    const fetchData = ()=>{
        Connection.get('company/dashboard/', (data)=>{
            setData(data);
            console.log(MEDIA_API + data.profile.picture);
        }, (error)=>{
            // alert('Error');
            requestFailureHandler(error, setRequestError, navigate);
        }, setLoading, true)
    }
    useEffect(()=>{
        document.title = "Dashboard - STM";
        fetchData();
    }, [])


    return (
        <div className={``}>
            <CompanyNavigation/>
            <Container className="borde mt-16 md:mt-20">
                {
                    loading ?
                    <div className="h-[200px] w-full flex items-center justify-center">
                        <CircularProgress size={23} sx={{
                            color: '#01406c'
                        }} />
                    </div>:
                    <Content data={data} />
                }
            </Container>
        </div>
    )
}

export default Dashboard;
