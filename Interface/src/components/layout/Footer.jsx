import { Container } from "@mui/material"
import logo from "../../assets/images/stm.png";
import { Link } from "react-router-dom";

function Footer() {

    const tabs = [
        {
            title: 'Students',
            links: [
                {label: 'Categories', path: '/categories'},
                {label: 'Companies', path: '/companies'},
                {label: 'How its works', path: '#'}
            ]
        },
        {
            title: 'Companies',
            links: [
                {label: 'Prices & Plans', path: '/prices-plans'},
                {label: 'Latest news', path: '/news'},
                {label: 'Help center', path: '/help-center'}
            ]
        },
        {
            title: 'Legal',
            links: [
                {label: 'CGU', path: '/usage-conditions'},
                {label: 'Privacy policy', path: '/privacy-policy'},
            ]
        }
    ]
    return (
        <div className={`min-h-[350px] mt-30 p-5 md:p-0  md:pt-14 bg-blue-focus`}>
            <Container className="">
                <div className="grid grid-cols-12 gap-3 w-full pb-4 border-b border-gray-700">
                    <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3">
                        <div className="flex items-center gap-1">
                            <img src={logo} alt="Stm brand" className="w-24"/>
                            <h4 className="roboto-bold text-[20px] text-white">Student mission</h4>
                        </div>
                        <p className="mt-5 text-gray-500 roboto">Email: <a href="mailto:support@jobhire.com" className="hover:underline text-sky roboto-medium">support@schoolmission.com</a></p>
                    </div>
                    {
                        tabs.map((tab, index)=>(
                            <div key={index} className="col-span-12 mt-3 md:col-span-6 lg:col-span-4 xl:col-span-3">
                                <strong className="font-normal! roboto-semibold text-[28px] text-gray-300">{tab.title}</strong>
                                <div className="mt-4">
                                    {
                                        tab.links.map((link, i)=>(
                                            <div key={i} className="mb-3">
                                                <Link to={link.path} className="no-underline! text-gray-500 text-[16px] roboto" >
                                                    {link.label}
                                                </Link>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="mt-5">
                    <p className="text-center text-gray-500 roboto">&copy; {new Date().getFullYear()} Student Mission. All right reserved</p>
                </div>
            </Container>
        </div>
    )
}

export default Footer;
