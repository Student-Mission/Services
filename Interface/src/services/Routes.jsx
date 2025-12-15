import { Route, Routes } from "react-router-dom";
import root_urls from "../features/Root/url_config";
import company_urls from "../features/Company/url_config";
import studentUrls from "../features/Student/url_config";

const urls = [
    ...root_urls,
    ...company_urls,
    ...studentUrls
]

function MyRouter() {

    return (
        <Routes>
            {
                urls.map((url, index)=> (
                    <Route path={url.path} element={url.component} key={index} />
                ))
            }
        </Routes>
    )
}

export default MyRouter;
