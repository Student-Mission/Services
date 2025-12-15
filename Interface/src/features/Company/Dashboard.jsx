import { useEffect } from "react";
import CompanyNavigation from "../../components/layout/CompanyNavigation";
import Container from "../../components/layout/Container";
import { BiSolidOffer } from "react-icons/bi";
import { HiQueueList, HiMiniSquare3Stack3D } from "react-icons/hi2";
import { PiBagSimpleFill } from "react-icons/pi";
import { LineChart, lineElementClasses, markElementClasses, PieChart } from "@mui/x-charts";
import { Box, Button } from "@mui/material";
import { LiaEbay } from "react-icons/lia";


function Content() {

    const headerStats = [
        {
            title: 'Active offers',
            value: 5,
            icon: BiSolidOffer
        },
        {
            title: 'Waiting applications',
            value: 8,
            icon: HiQueueList
        },
        {
            title: 'Students hired',
            value: 3,
            icon: PiBagSimpleFill
        },
        {
            title: 'All missions',
            value: 10,
            icon: HiMiniSquare3Stack3D
        }
    ]

    const lineChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const lineChartData = [12, 0, 9, 0, 1, 0, 1, 1, 0, 7, 19];

    const applicationsRate = [
        {
            label: 'Accepted',
            value: 12,
        },
        {
            label: 'Declined',
            value: 19
        },
        {
            label: 'Waiting for approval',
            value: 4
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

            <div className={`mt-5 grid grid-cols-12 gap-4`}>
                <div className={`p-3 col-span-12 lg:col-span-6 xl:col-span-8 xl:h-[400px] rounded-2xl shadow border border-gray-200`}>
                    <div className={`flex items-center justify-between`}>
                        <h5 className={`roboto text-[19px]`}>Monthly applications</h5>
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
                            // height={ 400}
                        
                        />
                    </Box>
                </div>
            </div>
        </div>
    )
}

function Dashboard() {

    useEffect(()=>{
        document.title = "Dashboard - STM"
    }, [])

    return (
        <div>
            <CompanyNavigation/>
            <Container className="borde mt-16 md:mt-20">
                <Content/>
            </Container>
        </div>
    )
}

export default Dashboard;
