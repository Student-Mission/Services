import Dashboard from "./Dashboard";
import FindMissions from "./FindMissions";
import MissionDetails from "./MissionDetails";
import Learn from "./Learn";
import Profile from "./Profile";
import Alerts from "./Alerts";
import SkillTest from "./SkillTest";

const prefix = '/student';
let studentUrls = [
    {path: '', component: <Dashboard/>},
    {path: '/find-missions', component: <FindMissions/>},
    {path: '/find-missions/:id', component: <MissionDetails/>},
    {path: '/learn', component: <Learn/>},
    {path: '/profile', component: <Profile/>},
    {path: '/alerts', component: <Alerts/>},
    {path: '/skills/:name/:id', component: <SkillTest/>}
]

studentUrls.map((url, index)=>{
    studentUrls[index].path = prefix + url.path;
})

export default studentUrls;
