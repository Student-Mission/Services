import { FormLabel } from "@mui/joy"
import { useState } from "react"
import { IoMdCloudUpload } from "react-icons/io"

const DocumentInput = ({label='Document Input', ID='just-file', maxSizeBytes= 5*1024*1024, handleError, onChange, multiple=false})=>{

    // const [error, setError] = useState(null);
    // const errorInventory = {
    //     sizeExceeded: {
    //         fr: "",
    //         en: ""
    //     },
    //     invalidFormat: {
    //         fr: "",
    //         en: ""
    //     }
    // }

    const allowedExt = ['md', 'doc', 'docx', 'pdf'];
    const allowedMime = [
        'text/markdown',
        'text/plain',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    const isAllowed = (file) => {
        // vérifie MIME si présent
        if (file.type && allowedMime.includes(file.type)) {
        return true;
        }
        // fallback : vérifie extension
        const ext = file.name.split('.').pop().toLowerCase();
        return allowedExt.includes(ext);
    };

    const handleFiles = (fileList) => {
        handleError(null);
        const arr = Array.from(fileList);
        // filtrer selon règles
        let valid = [];
        for (const f of arr) {
        if (!isAllowed(f)) {
            handleError({
                fr: `Format non autorisé: ${f.name}`,
                en: `Invalid file format: ${f.name}`
            });
            return;
        }
        if (f.size > maxSizeBytes) {
            handleError({
                fr: `Fichier trop volumineux: ${f.name}`,
                en: `File too large: ${f.name}`
            });
            return;
        }
        valid.push(f);
        }
        // setFiles(valid);
        onChange && onChange(multiple ? valid : valid[0] || null);
    };
    
    return (
        <div className={`mt-3 select-none cursor-pointer`}>
            <FormLabel className={`roboto text-gray-900 text-[16px]!`}>{label}</FormLabel>
            <label htmlFor={ID} className={`mt-1 w-full flex items-center justify-center border-2 border-dotted border-gray-300 rounded-lg bg-gray-50 h-[300px] md:h-[250px] xl:h-[200px]`}>
                <div className={``}>
                    <div className={`flex justify-center`}>
                        <IoMdCloudUpload className={`text-gray-500 text-[35px]`}/>
                    </div>
                    <p className={`mt-2 text-blue-500 text-center text-[17px]`}>Upload a file</p>
                    <p className={`roboto-light text-gray-400 text-center text-[15px] mt-1`}>PDF up to 5MB</p>
                </div>
            </label>
            <input type="file" id={ID} className="hidden"
                accept=".md,.doc,.docx,.pdf,text/markdown,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                multiple={multiple}
                onChange={(e)=> handleFiles(e.target.files)}
            />
        </div>
    )
}

export default DocumentInput;
