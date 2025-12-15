import { useState, useEffect, useContext } from "react";
import {HiOutlineDocumentAdd} from "react-icons/hi"
// import { ThemeContext } from "./ThemeProvider";

function FileInput({ placeholder='Select documents', onChange, multiple = false, maxSizeBytes = 5 * 1024 * 1024 }) {
  // const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  // const {theme} = useContext(ThemeContext);

  // extensions & MIME autorisés (note : .docs → .doc/.docx)
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
    setError('');
    const arr = Array.from(fileList);
    // filtrer selon règles
    let valid = [];
    for (const f of arr) {
      if (!isAllowed(f)) {
        setError(`Format non autorisé : ${f.name}`);
        return;
      }
      if (f.size > maxSizeBytes) {
        setError(`Fichier trop volumineux : ${f.name}`);
        return;
      }
      valid.push(f);
    }
    // setFiles(valid);
    onChange && onChange(multiple ? valid : valid[0] || null);
  };

  return (
    <div>
      <label className="inline-block w-full">
        <input
          type="file"
          accept=".md,.doc,.docx,.pdf,text/markdown,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          id="file-input"
        />
        <div className={`h-10 cursor-pointer p-2 gap-2 flex items-center border border-gray-200 hover:border-gray-950 hover:bg-gray-50`}>
            <HiOutlineDocumentAdd className={`text-[23px]`}/>
            <span className={`text-[13px] inter`}>{placeholder}</span>
        </div>
      </label>

      {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}

      {/* {files.length > 0 && (
        <ul className="mt-2 text-sm">
          {files.map((f, i) => (
            <Chip key={i} size={'md'} className={`ps-3 inter pe-3 pt-2 pb-2`} >
                {f.name} · {(f.size / 1024).toFixed(1)}KB
            </Chip>
            // <li key={i}>{f.name} · {(f.size / 1024).toFixed(1)} KB</li>
          ))}
        </ul>
      )} */}
    </div>
  );
}

export default FileInput;
