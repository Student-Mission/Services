import { useEffect, useState } from "react";
import AdminNavigation from "../../components/layout/AdminNavigation";
import Container from "../../components/layout/Container";
import {DataGrid} from "@mui/x-data-grid"
import { Avatar, Box, Button } from "@mui/material";
import { Input } from "@mui/joy";
import { MdOutlineDownload } from "react-icons/md";
import {LuDownload} from "react-icons/lu";
import { FaSearch } from "react-icons/fa";

function Header({activeTab, setActiveTab}) {

    const brief = "Monitor top performing students and companies across the platform";

    const tabs = [
        {
            value: "students",
            label: "Students"
        },
        {
            value: "companies",
            label: "Companies"
        }
    ]

    return (
        <div className={`mt-14`}>
            <h1 className={`roboto-semibold text-[30px]`}>Ranking & Performance</h1>
            <p className={`roboto text-gray-500`}>{brief}</p>
            <div className={`mt-10 h-[35px] border-b border-gray-300 flex items-center gap-3`}>
                {
                    tabs.map((tab, index)=>(
                        <div key={index} onClick={()=>setActiveTab(tab.value)} className={`border-b-2 px-1 h-full cursor-pointer border-transparent roboto text-gray-600 ${activeTab === tab.value && 'border-blue-main text-blue-main'}`}>
                            {tab.label}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

function CompaniesTable({}) {

    const getRankClass = (_rank)=> {
        if (_rank === 1)
            return 'gold'
        if (_rank === 2)
            return 'argent'
        if (_rank === 3)
            return 'bronze'
        return 'other'
    }

    const rankStyles = {
        gold: 'bg-amber-300/20 text-amber-500',
        argent: 'bg-gray-300/60 text-gray-500',
        bronze: 'bg-yellow-300/40 text-yellow-600',
        other: 'text-gray-500'
    }
    
    const statusStyles = {
        active: 'bg-green-300/50 text-green-500',
        inactive: 'bg-gray-200 text-gray-500'
    }

    const statusText = {
        active: "Active",
        inactive: "Inactive"
    }
    const columns = [
        {
            field: "id",
            headerName: "RANK",
            flex: 1,
            // width: 190,
            renderCell: (params)=>{
                const className = getRankClass(params.value);
                return (
                    <div className="ms-2">
                        <span className={`roboto-medium px-2 text-[13px] py-2 rounded-full ${rankStyles[className]}`}>
                            #{params.value}
                        </span>
                    </div>
                )
            }
        },
        {
            field: "company",
            headerName: "COMPANY",
            // width: 350,
            flex: 2.5,
            renderCell: (params)=> (
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <Avatar variant='square' src={params.row.picture} alt={params.row.name} sx={{
                        height: 35, width: 35
                    }} className={`bg-blue-main roboto text-[12px]!`} />
                    <p className={`roboto text-[14px]`}>{params.row.name}</p>
                </Box>
            )
        },
        {
            field: "applications",
            headerName: "APPLICATIONS",
            flex: 2,
            // width: 250,
            // renderCell: (params)=>(
            //     <p className={`roboto`}>⭐ {params.value.toPrecision(2)}</p>
            // )
        },
        {
            field: "missions",
            headerName: "MISSIONS",
            // width: 250
        },
        {
            field: "status",
            headerName: "STATUS",
            // width: 90,
            flex: 1.5,
            renderCell: (params)=>(
                <div className={`w-full`}>
                    <span className={`px-4 py-1 roboto text-[12px] rounded-2xl ${statusStyles[params.value]}`}>
                        {
                            statusText[params.value]
                        }
                    </span>
                </div>
            )
        },
    ]
    const rows = data.companies.map((company, index)=>(
        {
            ...company,
            ['id']: index + 1
        }
    ));

    return (
        <Box sx={{
            height: 400,
            width: '100%'
        }} className="mt-10 px-18a!">
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5
                        }
                    }
                }}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
                getRowId={(row)=>row.id}
                className="w-auto!"
                sx={{
                    '.MuiDataGrid-columnHeader': {
                        bgcolor: '#70707015',
                        fontFamily: 'Roboto',
                        color: '#707079'
                    },
                    borderRadius: 3
                }}
            />
        </Box>
    )
}

function StudentsTable({}) {

    const getRankClass = (_rank)=> {
        if (_rank === 1)
            return 'gold'
        if (_rank === 2)
            return 'argent'
        if (_rank === 3)
            return 'bronze'
        return 'other'
    }

    const rankStyles = {
        gold: 'bg-amber-300/20 text-amber-500',
        argent: 'bg-gray-300/60 text-gray-500',
        bronze: 'bg-yellow-300/40 text-yellow-600',
        other: 'text-gray-500'
    }

    const statusStyles = {
        active: 'bg-green-300/50 text-green-500',
        inactive: 'bg-gray-200 text-gray-500'
    }

    const statusText = {
        active: "Active",
        inactive: "Inactive"
    }

    const columns = [
        {
            field: "id",
            headerName: "RANK",
            flex: 1,
            // width: 190,
            renderCell: (params)=>{
                const className = getRankClass(params.value);
                return (
                    <div className="ms-2">
                        <span className={`roboto-medium px-2 text-[13px] py-2 rounded-full ${rankStyles[className]}`}>
                            #{params.value}
                        </span>
                    </div>
                )
            }
        },
        {
            field: "student",
            headerName: "STUDENT",
            // width: 350,
            flex: 2.5,
            renderCell: (params)=> (
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <Avatar src={params.row.picture} alt={params.row.username} sx={{
                        height: 35, width: 35
                    }} className={`bg-blue-main roboto text-[12px]!`} />
                    <p className={`roboto text-[14px]`}>{params.row.username}</p>
                </Box>
            )
        },
        {
            field: "global_rate",
            headerName: "GLOBAL RATE",
            flex: 2,
            // width: 250,
            renderCell: (params)=>(
                <p className={`roboto`}>⭐ {params.value.toPrecision(2)}</p>
            )
        },
        {
            field: "missions",
            headerName: "MISSIONS",
            // width: 250
        },
        {
            field: "status",
            headerName: "STATUS",
            // width: 90,
            flex: 1.5,
            renderCell: (params)=>(
                <div className={`w-full`}>
                    <span className={`px-4 py-1 roboto text-[12px] rounded-2xl ${statusStyles[params.value]}`}>
                        {
                            statusText[params.value]
                        }
                    </span>
                </div>
            )
        },
    ]
    const rows = data.students.map((student, index)=>(
        {
            ...student,
            ['id']: index + 1
        }
    ));

    return (
        <Box sx={{
            height: 400,
            width: '100%'
        }} className="mt-10 px-18a!">
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5
                        }
                    }
                }}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
                getRowId={(row)=>row.id}

                className="w-auto!"
                sx={{
                    '.MuiDataGrid-columnHeader': {
                        bgcolor: '#70707015',
                        fontFamily: 'Roboto',
                        color: '#707079'
                    },
                    borderRadius: 3
                }}
            />
        </Box>
    )
}

function Content({activeTab}) {

    return (
        <div>
            <div className={`w-full rounded-xl mt-10 bg-white border border-gray-200  py-2 px-4 mb-7 h-[70px] shadow-2xs flex justify-between items-center`}>
                <Input type="search" placeholder="Search by name, ID, ..." className={`w-[150px] xl:w-[400px]`} startDecorator={
                    <FaSearch/>
                } />
                <Button sx={{
                    textTransform: 'none'
                }} className={`bg-blue-main gap-2 text-white! w-[120px] h-[38px] roboto`}>
                    <LuDownload/>
                    Export
                </Button>
            </div>
            {
                activeTab === 'students' &&
                <StudentsTable/>
            }
            {
                activeTab === 'companies' &&
                <CompaniesTable/>
            }
        </div>
    )
}

function Leaderboard() {

    // Variables
    const [activeTab, setActiveTab] = useState('students'); // students or companies

    // Handlers
    useEffect(()=>{
        document.title = "Leaderboard | STM";
    }, [])

    return (
        <div className={`bg-gray-100 min-h-screen`}>
            <AdminNavigation current="leaderboard" />
            <Container className={`pt-16 md:pt-20`}>
                <Header activeTab={activeTab} setActiveTab={setActiveTab} />
                <Content activeTab={activeTab} />
            </Container>
        </div>
    )
}

const data = {
    students: [
        {
            username: "Sarah Jenkins",
            picture: "none",
            missions: 48,
            status: "active",
            global_rate: 9.8,
        },
        {
            username: "Michael Chen",
            picture: "none",
            missions: 32,
            status: "inactive",
            global_rate: 9.7,
        },
        {
            username: "Jessica Wright",
            picture: "none",
            missions: 29,
            status: "active",
            global_rate: 9.2,
        },
        {
            username: "David Kim",
            picture: "none",
            missions: 18,
            status: "active",
            global_rate: 8.3,
        },
        {
            username: "Emily Davis",
            picture: "none",
            missions: 25,
            status: "active",
            global_rate: 8.0,
        },
        {
            username: "Marcus Johnson",
            picture: "none",
            missions: 16,
            status: "active",
            global_rate: 7.9,
        },
    ],
    companies: [
        {
            name: "Ubisoft Inc.",
            picture: "none",
            applications: 1340,
            missions: 48,
            status: "active"
        },
        {
            name: "TechFlow",
            picture: "none",
            applications: 1120,
            missions: 23,
            status: "active"
        },
        {
            name: "GreenDays",
            picture: "none",
            applications: 1050,
            missions: 87,
            status: "active"
        },
        {
            name: "ECard",
            picture: "none",
            applications: 877,
            missions: 17,
            status: "active"
        },
    ]
}

export default Leaderboard;
