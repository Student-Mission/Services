import { useEffect, useState } from "react";
// import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa6";


const makeArray = (value)=>{
    if (value <= 0)
        return [];
    let array = [];
    for (let i = 0; i < value; i++) {
        array.push(i + 1);
    }
    return array;
}

function RateField({rate, setRate}) {

    const [currentRate, setCurrentRate] = useState(rate);
    // useEffect(()=>{
    //     setRate(currentRate);
    // }, [])
    const total = [1, 2, 3, 4, 5];

    const handleHover = (event, value)=>{
        setCurrentRate(value);
    }

    const handleBlur = (event)=>{
        setCurrentRate(rate);
    }

    const handleClick = (value)=>{
        setCurrentRate(value);
        setRate(value);
    }

    return (
        <div onMouseLeave={handleBlur} className={`w-full gap-4 grid grid-cols-5`}>
            {
                total.map((value)=>(
                    <div key={value} onClick={()=>handleClick(value)} onMouseEnter={(e)=>handleHover(e, value)}  className={`col-span-1 h-[35px] border border-gray-300 relative flex items-center justify-center`}>
                        <div style={{
                            height: currentRate >= value ? '100%': '0%',
                            transition: 'ease-in-out 200ms height'
                        }} className={`absolute bottom-0 active:bg-[#011524]! bg-sky w-full`}>
                        </div>
                        <FaStar className={`text-[15px] text-white z-10`} />
                    </div>
                ))
            }
        </div>
    )
}

export default RateField;
