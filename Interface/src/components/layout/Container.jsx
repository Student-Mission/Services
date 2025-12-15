import { useContext } from "react";
import { GlobalContext } from "../../contexts/Global";

function Container({children, className=''}) {

    const {navExtended} = useContext(GlobalContext);

    return (
        <div style={{ transition: 'width 260ms ease-in-out' }} className={`${navExtended ? 'lg:ms-[250px]': 'lg:ms-[60px]'} flex items-center justify-center ${className}`}>
            <div className={`w-full ps-[15px] pe-[15px] sm:max-w-[700px] sm:ps-0 sm:pe-0 md:max-w-[900px] lg:max-w-[1150px] xl:max-w-[1400px] 2xl:max-w-[1600]`}>
                {children}
            </div>
        </div>
    )
}

export default Container;
