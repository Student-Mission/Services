import { useEffect } from "react";
import CompanyNavigation from "../../components/layout/CompanyNavigation";

function HelpCenter() {

    useEffect(()=>{
        document.title = "Help Center | STM"
    }, []);

    return (
        <div className="">
            <CompanyNavigation current="help" />
        </div>
    )
}

export default HelpCenter;
