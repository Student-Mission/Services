import { FaFilePdf } from "react-icons/fa6";
import { GrDocument } from "react-icons/gr";

const getFileType = (name='')=>{
    const parts = name.split('.');

    if (parts.length === 1) {
        return 'blank';
    } else if (parts.length > 1 && parts[parts.length - 1].toLowerCase() === 'pdf') {
        return 'pdf';
    } else
        return 'blank';
}

function FileCard({file=null, className=''}) {

    return (
        file ?
        <div className={`p-2 gap-3 flex items-center w-[120px] h-[55px] border border-gray-300 hover:bg-slate-50 cursor-pointer select-none rounded-xl ${className}`}>
            {
                getFileType(file.name) === 'pdf' ?
                <FaFilePdf className={`text-[20px] text-red-600`}/>:
                <GrDocument className={``}/>
            }
            <div className={``}>
                <strong className={`roboto line-clamp-1 text-[12px] text-gray-main`}>{file.name}</strong>
            </div>
        </div>:
        <></>
    )
}

export default FileCard;
