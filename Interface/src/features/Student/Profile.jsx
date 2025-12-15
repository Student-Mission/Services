import { Avatar, Button, Container } from "@mui/material";
import StudentNavigation from "../../components/layout/StudentNavigation";
import { FaTrash, FaCircleCheck, FaClock } from "react-icons/fa6";
import { FaCrown } from "react-icons/fa";
import { Chip, FormControl, FormLabel, Input, Textarea } from "@mui/joy";
import { GoDownload, GoPlus, GoUpload } from "react-icons/go";
import { IoMdLock, IoMdCloudUpload } from "react-icons/io";
import RateSkillModal from "../../components/ui/RateSkillModal";
import { useState } from "react";

const profile = {
    personal: {
        username: 'Abiola Shadow',
        email: 'abiolashadow@fake.com',
        bio: "Just a game developer",
        picture: 'none'
    },
    details: {
        skills: ['C++', 'C', 'C#', 'Python'],
        level: 'Rookie',
        global_rate: 8.2,
        status: 'validated',
        profile_completion: 75,
        kycs: [
            {
                title: 'Enrollment Certificate 2025-2026',
                created_at: '2025-12-05',
                status: 'pending',
            },
            {
                title: 'Enrollment Certificate 2022-2023',
                created_at: '2022-09-05',
                status: 'validated',
            },
            {
                title: 'Enrollment Certificate 2021-2022',
                created_at: '2021-09-19',
                status: 'validated',
            }
        ]
    }
}

// Annexes components
const DocumentInput = ({})=>{

    return (
        <div className={`mt-3 select-none cursor-pointer`}>
            <FormLabel className={`roboto text-gray-900 text-[16px]!`}>Document Input</FormLabel>
            <label className={`mt-1 w-full flex items-center justify-center border-2 border-dotted border-gray-300 rounded-lg bg-gray-50 h-[300px] md:h-[250px] xl:h-[200px]`}>
                <div className={``}>
                    <div className={`flex justify-center`}>
                        <IoMdCloudUpload className={`text-gray-500 text-[35px]`}/>
                    </div>
                    <p className={`mt-2 text-blue-500 text-center text-[17px]`}>Upload a file</p>
                    <p className={`roboto-light text-gray-400 text-center text-[15px] mt-1`}>PDF up to 5MB</p>
                </div>
            </label>
        </div>
    )
}

// Main components

function Content({setShowSkillDetails}) {

    return (
        <div className={`w-full grid grid-cols-12 gap-5 pt-[130px] pb-10`}>
            <div className={`col-span-12 md:col-span-6 lg:col-span-4`}>
                <div className={`w-full bg-white shadow-2xs rounded-2xl p-4 py-6 border border-gray-200`}>
                    <div className={`flex items-center gap-3 px-6`}>
                        <Avatar src={profile.personal.picture} alt={profile.personal.username} className={`bg-blue-main roboto-medium w-[60px]! h-[60px]!`} />
                        <div className={``}>
                            <div className={`flex items-center gap-2`}>
                                <h4 className={`roboto-medium text-[21px] text-blue-focus`}>{profile.personal.username}</h4>
                                <Chip variant='outlined' className={`border-sky-dark text-sky-dark roboto`}>
                                    Free
                                </Chip>
                            </div>
                            <p className={`roboto-light mt-1 text-gray-500`}>{profile.details.level} | {profile.details.global_rate} ⭐</p>
                        </div>
                    </div>
                    <div className={`mt-3 px-6`}>
                        <Button sx={{
                            // textTransform: 'none'
                        }} variant='outlined' className={`gap-2 w-full`}>
                            <FaCrown className={`text-xl`}/>
                            Upgrade
                        </Button>
                    </div>
                </div>
            </div>
            <div className={`col-span-12 md:col-span-6 lg:col-span-8`}>
                <div className={`p-3 py-4 bg-white shadow-2xs rounded-2xl border border-gray-200`}>
                    <div className={`flex justify-between items-center`}>
                        <h3 className={`text-[22px] roboto-medium`}>Profile Completion</h3>
                        <strong className={`font-normal roboto text-green`}>{profile.details.profile_completion}%</strong>
                    </div>
                    <div className={`mt-2 w-full h-[9px] rounded-full bg-gray-200`}>
                        <div style={{
                            width: `${profile.details.profile_completion}%`
                        }} className={`h-full rounded-full bg-green`}>
                        </div>
                    </div>
                    <p className={`text-gray-500 roboto-light mt-2`}>Complete your profile</p>
                </div>

                <div className={`p-3 py-4 mt-5 bg-white shadow-2xs rounded-2xl border border-gray-200`}>
                    <div className={`flex items-center gap-3 pb-4 border-b border-gray-200`}>
                        <h4 className={`text-[19px] roboto-medium`}>Personal Information</h4>
                    </div>
                    <div className={`mt-4 p-3`}>
                        <div className={``}>
                            <h6 className={`roboto text-blue-focus`}>Profile picture</h6>
                            <div className={`flex mt-3 items-center gap-5`}>
                                <Avatar src={profile.personal.picture} alt={profile.personal.username} className={`bg-blue-main roboto w-[65px]! h-[65px]! `} />

                                <FormLabel>
                                    <Button sx={{
                                        textTransform: 'none'
                                    }} className={`roboto gap-2 px-5! text-white! bg-blue-600! `}>
                                        <GoUpload className={``}/>
                                        Upload
                                    </Button>
                                </FormLabel>
                                <Button sx={{
                                    textTransform: 'none'
                                }} variant='outlined' className={`gap-2 roboto border-gray-500! text-gray-500!`}>
                                    <FaTrash className={``}/>
                                    Remove
                                </Button>
                            </div>
                            <p className={`text-[12px] mt-1 text-gray-600 roboto-light`}>Recommended size: 400x400px. JPG, PNG or JPEG</p>
                        </div>

                        <div className={`mt-4 w-full`}>
                            <div className={`flex items-center gap-4`}>
                                <FormControl className={`w-[50%]`}>
                                    <FormLabel className={`roboto`}>Username</FormLabel>
                                    <Input className={`roboto`} value={profile.personal.username} placeholder="Ex: John Doe" />
                                </FormControl>
                                <FormControl className={`w-[50%]`}>
                                    <FormLabel className={`roboto`}>Email</FormLabel>
                                    <Input type='email' value={profile.personal.email} placeholder="" className={`roboto`} />
                                </FormControl>
                            </div>
                            <FormControl className={`mt-3 pb-5 border-b border-gray-200`}>
                                <FormLabel className={`roboto`}>Bio</FormLabel>
                                <Textarea minRows={7} placeholder="Define your bio" className={``} />
                            </FormControl>
                        </div>
                        <div className={`mt-5 pb-5 border-b border-gray-300 flex items-end justify-between`}>
                            <div className={``}>
                                <h6 className={`roboto`}>Security</h6>
                                <p className={`mt-5 roboto-light text-gray-main`}>Manage your account security settings.</p>
                            </div>
                            <div className={`flex items-center h-full justify-end`}>
                                <Button sx={{
                                    textTransform: 'none'
                                }} variant='outlined' className={`gap-2 roboto border-gray-400! text-blue-focus`}>
                                    <IoMdLock className={`text-[18px]`}/>
                                    Change Password
                                </Button>
                            </div>
                        </div>
                        <div className={`mt-4 gap-4 flex items-center justify-end`}>
                            <Button sx={{
                                textTransform: 'none'
                            }} className={`bg-gray-200! text-black! h-[38px] roboto`}>
                                Reset
                            </Button>
                            <Button sx={{
                                textTransform: 'none'
                            }} className={`bg-blue-600! text-white! roboto`}>
                                Save changes
                            </Button>
                        </div>
                    </div>
                </div>

                <div className={`p-3 py-4 mt-5 bg-white shadow-2xs rounded-2xl border border-gray-200`}>
                    <div className={`flex items-center justify-between pb-4 border-b border-gray-200`}>
                        <h4 className={`roboto-medium text-[19px] text-blue-focus`}>Skills & Competencies</h4>
                        <Button sx={{
                            textTransform: 'none'
                        }} className={`gap-1 text-white! roboto bg-blue-600!`}>
                            <GoPlus className={`text-[20px]`}/>
                            Add Skills
                        </Button>
                    </div>
                    <div className={`mt-5`}>
                        <p className={`roboto-light text-gray-500 text-[18px]`}>Showcase your abilities for projects.</p>
                        <div className={`flex flex-wrap gap-5 mt-4`}>
                            {
                                profile.details.skills.map((skill, index)=>(
                                    <Chip onClick={()=>{
                                        setShowSkillDetails(true)
                                    }} key={index} className={`text-blue-600! cursor-pointer! px-6! roboto bg-blue-600/20!`}>
                                        {skill}
                                    </Chip>
                                ))
                            }
                        </div>
                    </div>
                </div>

                <div className={`p-3 py-4 mt-5 bg-white shadow-2xs rounded-2xl border border-gray-200`}>
                    <div className={`p-3 border-b border-gray-300`}>
                        <h4 className={`roboto-medium text-blue-focus text-[19px]`}>Student Proof</h4>
                        <p className={`roboto-light text-gray-500 text-[15px]`}>Upload your proof of enrollment for the current academic year if not.</p>
                    </div>
                    <div className={`mt-5 pb-5 p-3 border-b border-gray-200`}>
                        <FormControl>
                            <FormLabel className={`roboto text-[16px]! text-gray-600`}>Title</FormLabel>
                            <Input placeholder="Ex: Enrollment doc" type='text' />
                        </FormControl>
                        <DocumentInput/>
                        <div className={`mt-3 flex justify-end`}>
                            <Button sx={{
                                textTransform: 'none'
                            }} className={`bg-blue-600! roboto text-white!`}>
                                Submit Proof
                            </Button>
                        </div>
                    </div>
                    <div className={`mt-4 p-3`}>
                        <h5 className={`text-[18px] roboto-medium text-blue-focus`}>Submission History</h5>
                        <div className={`mt-3`}>
                            {
                                profile.details.kycs.map((history, index)=>(
                                    <div key={index} className={`mb-3 p-4 h-[77px] flex items-center gap-4 border border-gray-300 rounded-2xl bg-gray-50`}>
                                        {
                                            history.status === 'validated' &&
                                            <FaCircleCheck className={`text-[20px] text-green-600`} />
                                        }
                                        {
                                            history.status === 'pending' &&
                                            <FaClock className={`text-amber-600 text-[20px]`}/>
                                        }
                                        <div className={``}>
                                            <strong className={`font-normal text-[17px] roboto text-blue-focus`}>{history.title}</strong>
                                            <p className={`roboto-light text-gray-500`}>Submitted on: {history.created_at}</p>
                                        </div>
                                        <div className={`flex flex-1 justify-end`}>
                                            <Button sx={{
                                                textTransform: 'none'
                                            }} className={`gap-2 text-gray-500! roboto bg-white! border! border-gray-200!`}>
                                                <GoDownload className={`text-[17px]`}/>
                                                Download
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Profile() {

    const [showSkillDetails, setShowSkillDetails] = useState(false);

    return (
        <div className={`min-h-screen bg-gray-100`}>
            <RateSkillModal show={showSkillDetails} onHide={()=>setShowSkillDetails(false)} />
            <StudentNavigation/>
            <Container>
                <Content setShowSkillDetails={setShowSkillDetails} />
            </Container>
        </div>
    )
}

export default Profile;
