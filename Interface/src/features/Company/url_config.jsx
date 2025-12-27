import Dashboard from "./Dashboard";
import Missions from "./Missions";
import NewMission from "./NewMission";
import MissionDetails from "./MissionDetails";
import Settings from "./Settings";
import Alerts from "./Alerts";

let prefix = '/company';
let company_urls = [
    {path: '', component: <Dashboard/>},
    {path: '/missions', component: <Missions/>},
    {path: '/missions/:id', component: <MissionDetails/>},
    {path: '/new-mission', component: <NewMission/>},
    {path: '/settings', component: <Settings/>},
    {path: '/alerts', component: <Alerts/>}
]

company_urls.map((url, index)=>{
    company_urls[index].path = prefix + url.path;
})

export default company_urls;
