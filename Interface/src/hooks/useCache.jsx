import { useEffect, useState } from "react";

const secondsToMil = (sec)=>{
    return sec * 1000;
}

function useCache(seconds=20, data=null) {

    const [value, setValue] = useState(data);

    useEffect(()=>{
        if (value)
            return;
        const timer = setTimeout(()=>{
            setValue(null);
        }, secondsToMil(seconds))

    }, [value])

    return [value, setValue]
}

export default useCache;
