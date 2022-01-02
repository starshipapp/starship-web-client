import { useQuery } from "@apollo/client";
import getCurrentUser, { IGetCurrentUserData } from "../graphql/queries/users/getCurrentUser";
import { Route } from "react-router";
import GAdminHome from "./GAdminHome";
import GAdminReports from "./GAdminReports";
import GAdminUsers from "./GAdminUsers";
import GAdminPlanets from "./GAdminPlanets";
import { Routes } from "react-router-dom";
import NonIdealState from "../components/display/NonIdealState";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

function GAdmin(): JSX.Element {
  const {data} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });

  return (
    <div className="flex w-full flex-shrink max-w-full overflow-hidden">
        {(data?.currentUser && data.currentUser.admin) ? <Routes>
          <Route path="/" element={<GAdminHome/>}/>
          <Route path="/users" element={<GAdminUsers/>}/>
          <Route path="/planets" element={<GAdminPlanets/>}/>
          <Route path="/reports" element={<GAdminReports/>}/> 
        </Routes> : <div className="GAdmin-not-allowed">
          <NonIdealState
            icon={faExclamationTriangle}
            title="Forbidden"
          >You don't have permission to view this page.</NonIdealState>
        </div>}
    </div>
  );
}

export default GAdmin;
