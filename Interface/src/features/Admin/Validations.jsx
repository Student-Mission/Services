import { useEffect, useState } from "react";
import AdminNavigation from "../../components/layout/AdminNavigation";
import Container from "../../components/layout/Container";
import { FaCircleCheck, FaCircleExclamation, FaClock } from "react-icons/fa6";
import { MdLibraryAddCheck } from "react-icons/md";
import { Avatar } from "@mui/material";
import { GoDotFill } from "react-icons/go";


function Header({}) {

    const details = [
        {
            label: 'PENDING VALIDATIONS',
            value: data.header.pending_validations,
            icon: FaClock,
            class: 'bg-amber-300/40 text-amber-500'
        },
        {
            label: 'TOTAL APPROVED',
            value: data.header.total_approved,
            icon: MdLibraryAddCheck,
            class: 'bg-green-300/40 text-green-600'
        },
        {
            label: 'TOTAL_DECLINED',
            value: data.header.total_declined,
            icon: FaCircleExclamation,
            class: 'bg-[#e2717121] text-red-500'
        },
        {
            label: 'APPROVED TODAY',
            value: data.header.approved_today,
            icon: FaCircleCheck,
            class: 'bg-green-300/40 text-green-600'
        }
    ]

    return (
        <div className={`mt-10`}>
            <div className={`grid grid-cols-12 gap-4`}>
                {
                    details.map((detail, index)=>(
                        <div key={index} className={`col-span-12 md:col-span-6 xl:col-span-3 px-4 py-3 bg-white flex items-center h-[100px] rounded-xl border border-gray-200 shadow-2xs`}>
                            <div className={``}>
                                <strong className={`font-normal text-[14px] text-gray-500 roboto-medium`}>{detail.label}</strong>
                                <h5 className={`roboto-semibold text-[19px]`}>{detail.value}</h5>
                            </div>
                            <div className={`flex-1 flex justify-end`}>
                                <div className={`px-3 py-1 rounded-2xl ${detail.class}`}>
                                    <detail.icon className={`text-[17px]`}/>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

function Content({}) {

    const tabs = [
        {
            label: 'Students',
            value: 'students'
        },
        {
            label: 'Companies',
            value: 'companies'
        },
    ]
    const [activeTab, setActiveTab] = useState('students');
    const columns = [
        'APPLICANT',
        'DOCUMENT TITLE',
        'SUBMITTED',
        'STATUS',
        'ACTION'
    ]
    const columnsCols = [
        'col-span-3',
        'col-span-3',
        'col-span-2',
        'col-span-2',
        'col-span-2'
    ]

    return (
        <div className={`mt-10 rounded-2xl border border-gray-300 bg-gray-200/30`}>
            <div className={`h-[42px] px-5 border-b border-gray-300 flex items-center w-full justify-between`}>
                <div className={`flex items-center gap-2 bg-gray-200 h-[35px] rounded-md`}>
                    {
                        tabs.map((tab, index)=>(
                            <div key={index} className={`px-4 h-[96%] rounded-md flex items-center roboto text-gray-500 ${activeTab === tab.value && 'bg-white text-black shadow-2xs'}`}>
                                {tab.label}
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className={`w-full grid grid-cols-12 px-4 h-[55px] border-b border-gray-300 items-center`}>
                {
                    columns.map((col, index)=>(
                        <div key={index} className={`text-[14px] roboto-medium text-gray-500 ${columnsCols[index]}`}>
                            {col}
                        </div>
                    ))
                }
            </div>
            <div className={``}>
                {
                    activeTab === 'students' && data.content.students.map((student, index)=>(
                        <div key={index} className={`w-full grid grid-cols-12 px-4 h-[55px] bg-white border-b border-gray-300 items-center`}>
                            <div className={`col-span-3 flex items-center gap-2`}>
                                <Avatar src={student.user.picture} alt={student.user.username} className={`bg-blue-main roboto text-[15px]!`} />
                                <div className={``}>
                                    <h5 className={`roboto-medium text-[15px]`}>{student.user.username}</h5>
                                    <div className={`flex text-[11px] roboto text-gray-500 items-center gap-1`}>
                                        <p className={``}>Student</p>
                                        <GoDotFill className={`text-gray-400 text-[8px]`}/>
                                        <p className={``}>{student.user.email}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={`col-span-3 roboto text-gray-700 text-[14px] flex items-center`}>
                                {student.title}
                            </div>
                            <div className={`col-span-2`}>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

function Validations({}) {

    useEffect(()=>{
        document.title = "Validations | STM";
    }, [])

    return (
        <div className={`min-h-screen bg-gray-100`}>
            <AdminNavigation current="validations" />
            <Container className={`pt-16 md:pt-20`}>
                <Header/>
                <Content/>
            </Container>
        </div>
    )
}

const data = {
    header: {
        pending_validations: 30,
        total_approved: 12,
        total_declined: 1,
        approved_today: 3
    },
    content: {
  students: [
    {
      user: { username: "jdoe", email: "john.doe@example.com", picture: "https://i.pravatar.cc/150?u=jdoe" },
      title: "CV_John_Doe.pdf",
      submitted_at: "2025-12-10T09:12:00Z",
      status: "validated"
    },
    {
      user: { username: "mdurand", email: "marie.durand@example.fr", picture: "none" },
      title: "ID_Marie_Durand.png",
      submitted_at: "2025-12-11T14:30:00Z",
      status: "in_progress"
    },
    {
      user: { username: "aben", email: "ali.ben@example.com", picture: "https://randomuser.me/api/portraits/men/32.jpg" },
      title: "Diploma_Ali_Ben.pdf",
      submitted_at: "2025-11-20T08:00:00Z",
      status: "not-validated"
    },
    {
      user: { username: "srossi", email: "sofia.rossi@example.it", picture: "none" },
      title: "Transcript_Sofia_Rossi.pdf",
      submitted_at: "2025-12-01T12:45:00Z",
      status: "in_progress"
    },
    {
      user: { username: "lmartin", email: "lucas.martin@example.com", picture: "https://i.pravatar.cc/150?u=lmartin" },
      title: "Portfolio_Lucas_Martin.zip",
      submitted_at: "2025-10-05T16:20:00Z",
      status: "validated"
    },
    {
      user: { username: "egarcia", email: "elena.garcia@example.es", picture: "https://randomuser.me/api/portraits/women/65.jpg" },
      title: "Certificat_Stage_Elena.pdf",
      submitted_at: "2025-12-25T07:00:00Z",
      status: "not-validated"
    },
    {
      user: { username: "tmuller", email: "tom.mueller@example.de", picture: "none" },
      title: "ID_Tom_Muller.jpg",
      submitted_at: "2025-12-30T23:59:59Z",
      status: "in_progress"
    }
  ],
  companies: [
    {
      company: { name: "Tech Solutions SARL", description: "Développement logiciel et services IT", picture: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80" },
      title: "Company_Registration_TechSolutions.pdf",
      updated_at: "2025-12-15T10:00:00Z",
      status: "pending"
    },
    {
      company: { name: "GreenFoods Ltd", description: "Production alimentaire durable", picture: "https://images.unsplash.com/photo-1506804881991-0b4a3d6f1b1a?w=600&q=80" },
      title: "FoodSafetyCert_GreenFoods.pdf",
      updated_at: "2025-11-20T09:30:00Z",
      status: "validated"
    },
    {
      company: { name: "EduPartners", description: "Plateforme et partenariats éducatifs", picture: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&q=80" },
      title: "Partnership_Agreement_EduPartners.pdf",
      updated_at: "2025-12-01T13:15:00Z",
      status: "not-validated"
    },
    {
      company: { name: "Urban Build", description: "Construction et urbanisme", picture: "https://images.unsplash.com/photo-1505842465776-3b8a4c3e9b4d?w=600&q=80" },
      title: "License_UrbanBuild.pdf",
      updated_at: "2025-12-28T18:45:00Z",
      status: "pending"
    },
    {
      company: { name: "HealthCare Plus", description: "Services de santé et bien-être", picture: "https://images.unsplash.com/photo-1556628173-4d9b6baf9b2a?w=600&q=80" },
      title: "Compliance_HealthCarePlus.pdf",
      updated_at: "2025-12-05T11:11:11Z",
      status: "validated"
    }
  ]
}
}

export default Validations;
