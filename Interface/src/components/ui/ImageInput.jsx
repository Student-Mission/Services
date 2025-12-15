import upload from "../../assets/images/upload.png";
import { useState } from "react";

// type ImageInputProps = {
//     setImage: Function,
//     allowed: '*' | 'png' | 'jpg' | 'jpeg',
//     ID: string,
//     className: string,
//     defaultLabel: string | null
// }

function ImageInput({setImage, allowed='*', ID, className='', defaultLabel=null}) {

    const [file, setFile] = useState(defaultLabel);

    const handle_change = (event)=> {
        const rawFile = event.target.files?.[0];
        if (rawFile) {
            const reader = new FileReader();
            reader.onload = ()=> setFile(reader.result);
            reader.readAsDataURL(rawFile);
            setImage(rawFile);
        }
    }

    return (
        <div className={`${className}`} >
            <label htmlFor={ID} className={`w-full`}>
                {
                    !file ?
                    <img className="w-full" src={upload} alt="Sample input" />:
                    <img className="w-full" src={file} alt="Sample input" />
                }
            </label>
            <input type="file" id={ID} onChange={handle_change} accept={`image/${allowed}`} className="d-none hidden!" />
        </div>
    )
}

export default ImageInput;
