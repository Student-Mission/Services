import Navigation from "../../components/layout/Navigation"
import Footer from "../../components/layout/Footer"
import { Container, FormControl, FormLabel, Button } from "@mui/material"
import { Textarea, Input } from "@mui/joy"
import { useEffect } from "react"
import { BsArrowRightCircleFill } from "react-icons/bs";

function Content() {

    const title = "Contact us";
    const brief = "Need help or have a partnership idea? Reach out to our team for support, collaborations, or press inquiries. We aim to respond within 2 business days.";

    return (
        <div className={`mt-16 pt-16 mb-16 min-h-[700px] bg-[#01406c07] md:mt-20`}>
            <Container className={`grid grid-cols-12 gap-4`}>
                <div className={`col-span-12 lg:col-span-6`}>
                    <h1 className={`text-[38px] mt-5 roboto-semibold`}>{title}</h1>
                    <p className={`mt-4 roboto-light text-[21px]`}>{brief}</p>
                    <p className={`mt-10 roboto text-[17px]`}>Email: <span className={`text-[18px] text-sky roboto-medium`}>support@studentmissions.com</span></p>
                </div>
                <div className={`col-span-12 lg:col-span-6 bg-white rounded-2xl shadow-md p-5`}>
                    <div className={`w-full flex items-center gap-2`}>
                        <FormControl className={`w-[50%]`}>
                            <FormLabel className={``}>First name</FormLabel>
                            <Input placeholder="Enter your first name" className={`mt-2`} />
                        </FormControl>
                        <FormControl className={`w-[50%]`}>
                            <FormLabel className={``}>Last name</FormLabel>
                            <Input placeholder="Enter your last name" className={`mt-2`} />
                        </FormControl>
                    </div>
                    <div className={`mt-5`}>
                        <FormControl className={`w-full`}>
                            <FormLabel className={``}>Email</FormLabel>
                            <Input placeholder="Enter your email address" type='email' className={`mt-2`} />
                        </FormControl>
                    </div>
                    <div className={`mt-5`}>
                        <FormControl className={`w-full`}>
                            <FormLabel className={``}>How can we help you?</FormLabel>
                            <Textarea minRows={12} placeholder="Enter your message" className={`mt-2 w-full`} />
                        </FormControl>
                    </div>
                    <div className="mt-5 flex justify-end">
                        <Button className="bg-blue-main ps-4! pe-4! transition-all! duration-200 ease-in-out hover:-translate-y-2 h-[50px] rounded-full! text-white! roboto-medium">
                            Send message
                            <BsArrowRightCircleFill className="text-[25px] ms-4 "/>
                        </Button>
                    </div>
                </div>
            </Container>
        </div>
    )
}

function Contact() {

    useEffect(()=>{
        document.title = "Contact - STM";
        window.scrollTo({top: 0, behavior: 'smooth'})
    })

    return (
        <div className="">
            <Navigation current="contact" />
            <Content/>
            <Footer/>
        </div>
    )
}

export default Contact;
