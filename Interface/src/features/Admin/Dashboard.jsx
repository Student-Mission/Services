import { Avatar, Button } from "@mui/material";
import AdminNavigation from "../../components/layout/AdminNavigation";
import Container from "../../components/layout/Container";
import { FaTicketAlt } from "react-icons/fa";
import { IoBag } from "react-icons/io5";
import { BsStack } from "react-icons/bs";
import { HiUsers } from "react-icons/hi2";
import { LineChart, lineElementClasses, markElementClasses, PieChart } from "@mui/x-charts";
import { Box, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { Chip } from "@mui/joy";

function Header({header}) {

    const details = [
        {
            title: "TOTAL MISSIONS",
            value: data.header.missions,
            icon: BsStack,
        },
        {
            title: "AVAILABLE MISSIONS",
            value: data.header.available_missions,
            icon: IoBag,
        },
        {
            title: "ACTIVE USERS",
            value: data.header.active_users,
            icon: HiUsers,
        },
        {
            title: "UNRESOLVED HELP TICKETS",
            value: data.header.unresolved_help_tickets,
            icon: FaTicketAlt,
        },
    ]

    return (
        <div className={``}>
            <div className={`mt-16 flex items-center justify-between w-full`}>
                <h2 className={`roboto-medium text-[40px]`}>Welcome, {profile.username}</h2>
                <Button sx={{
                    textTransform: 'none'
                }} className={`roboto-medium text-white! bg-blue-main w-[120px] h-[38px]`}>
                    Export to PDF
                </Button>
            </div>
            <div className={`mt-7 grid grid-cols-12 gap-3`}>
                {
                    details.map((detail, index)=>(
                        <div key={index} className={`h-[120px] bg-white border border-gray-200 rounded-xl p-4 col-span-12 md:col-span-6 xl:col-span-3`}>
                            <div className={`flex justify-between items-center w-full`}>
                                <strong className={`font-normal roboto-medium text-[15px] text-gray-500`}>{detail.title}</strong>
                                <div className={`w-8 h-8 rounded-full bg-blue-300/50 flex items-center justify-center`}>
                                    <detail.icon className={`text-blue-500 text-[19px]`}/>
                                </div>
                            </div>
                            <h3 className={`roboto-semibold text-[30px]`}>{detail.value}</h3>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}


function Content({content}) {

    // Charts
    const lineChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const lineChartData = data.content.missions_per_month;
    const pieChartData = [
        {
            label: "Accepted",
            value: data.content.rates.accepted,
            color: "#03d693"
        },
        {
            label: "Pending",
            value: data.content.rates.pending,
            color: "#02616b"
        },
        {
            label: "Declined",
            value: data.content.rates.rejected,
            color: "#e27171"
        },
    ]
    
    return (
        <div className={`w-full grid grid-cols-12 gap-3 mt-10`}>
            <div className={`p-3 bg-white py-7 col-span-12 lg:col-span-6 xl:col-span-8 xl:h-[400px] rounded-2xl shadow border border-gray-200`}>
                <h5 className={`roboto-medium text-[19px]`}>Monthly missions published</h5>
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
            <div className={`p-3 py-7 col-span-12 h-[400px] lg:col-span-6 xl:col-span-4 bg-white shadow rounded-2xl border border-gray-200`}>
                <h3 className={`roboto-medium text-[21px]`}>Application rates</h3>
                <PieChart series={[
                    {
                        innerRadius: 50,
                        outerRadius: 100,
                        data: pieChartData,

                    }
                ]} />
            </div>
            <div className={`col-span-12 my-10 px-5 py-7 lg:col-span-6 shadow rounded-2xl bg-white`}>
                <div className={`flex items-center w-full justify-between`}>
                    <h3 className={`roboto-medium text-[18px]`}>Top students</h3>
                    <Link to={`/admin/leaderboard`} className={`text-sky-dark roboto`}>View All</Link>
                </div>
                <div className={`mt-4`}>
                    {
                        data.content.top_students.map((student, index)=>(
                            <div key={index} className={`h-[65px] gap-3 flex items-center justify-around w-full ${index !== 0 && 'border-t border-gray-200'}`}>
                                <Avatar src={student.picture} alt={student.username} className={`bg-blue-main roboto`} />
                                <div className={``}>
                                    <strong className={`font-normal roboto-medium text-[16px]`}>{student.username}</strong>
                                    <p className={`roboto text-gray-500 text-[13px]`}>{student.missions} missions</p>
                                </div>
                                <div className={`h-full flex flex-1 items-center justify-end`}>
                                    <Chip className="p-1 px-4! bg-[#e2717121]!">
                                        ⭐ {student.global_rate}
                                    </Chip>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className={`col-span-12 my-10 px-5 py-7 lg:col-span-6 shadow rounded-2xl bg-white`}>
                <div className={`flex items-center w-full justify-between`}>
                    <h3 className={`roboto-medium text-[18px]`}>Top companies</h3>
                    <Link to={`/admin/leaderboard`} className={`text-sky-dark roboto text-[14px]!`}>View All</Link>
                </div>
                <div className={`mt-4`}>
                    {
                        data.content.top_companies.map((company, index)=>(
                            <div key={index} className={`h-[65px] gap-3 flex items-center justify-around w-full ${index !== 0 && 'border-t border-gray-200'}`}>
                                <Avatar variant='rounded' src={'student.picture'} alt={company.name} className={`bg-blue-main roboto`} />
                                <div className={``}>
                                    <strong className={`font-normal roboto-medium text-[16px]`}>{company.name}</strong>
                                    {/* <p className={`roboto text-gray-500 text-[13px]`}>{student.missions} missions</p> */}
                                </div>
                                <div className={`h-full flex flex-1 items-center justify-end`}>
                                    <div className={``}>
                                        <h6 className={`text-[17px] roboto-medium`}>{company.applications}</h6>
                                        <p className={`text-gray-500 roboto text-[11px]`}>APPS</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}


function Dashboard() {

    return (
        <div className={`pt-16 md:pt-20 min-h-screen bg-gray-100`}>
            <AdminNavigation current="dashboard" />
            <Container>
                <Header header={data.header} />
                <Content content={data.content} />
            </Container>
        </div>
    )
}


const profile = {
    username: "Admin",
    picture: "none"
}

const data = {
    header: {
        missions: 1239,
        available_missions: 1002,
        active_users: 120,
        unresolved_help_tickets: 20
    },
    content: {
        missions_per_month: [11, 39, 101, 200, 2, 33, 12, 88, 22, 49, 8, 17],
        rates: {
            accepted: 200,
            pending: 453,
            rejected: 177
        },
        top_students: [
            {
                username: "Sarah Jenkins",
                picture: "https://i.pravatar.cc/150?u=amina85",
                missions: 22,
                global_rate: 9.8
            },
            {
                username: "David Chen",
                picture: "none",
                missions: 18,
                global_rate: 8.1
            },
            {
                username: "Maria Rodriguez",
                picture: "https://i.pravatar.cc/150?u=Maria",
                missions: 7,
                global_rate: 6.8
            },
        ],
        top_companies: [
            {
                name: "Ubisoft Inc.",
                picture: "",
                applications: 230
            },
            {
                name: "Coris Bank",
                picture: "",
                applications: 90
            },
            {
                name: "Microsoft | Teams",
                picture: "",
                applications: 79
            },
        ]
    }
}

export default Dashboard;
