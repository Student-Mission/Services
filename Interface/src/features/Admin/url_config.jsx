import Dashboard from "./Dashboard";
import Leaderboard from "./Leaderboard";
import Validations from "./Validations";

const prefix = '/admin';

const adminUrls = [
    {path: '', component: <Dashboard/>},
    {path: '/leaderboard', component: <Leaderboard/>},
    {path: '/validations', component: <Validations/>}
]

adminUrls.map((link, index)=>{
    adminUrls[index].path = prefix + link.path;
})

export default adminUrls;
