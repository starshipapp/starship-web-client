import React from "react";
import { NonIdealState } from "@blueprintjs/core";
import { useQuery } from "@apollo/client";
import getCurrentUser, { IGetCurrentUserData } from "../graphql/queries/users/getCurrentUser";
import { Route, Switch, useRouteMatch } from "react-router";
import GAdminHome from "./GAdminHome";
import "./css/GAdmin.css";
import GAdminSidebar from "./GAdminSidebar";
import GAdminReports from "./GAdminReports";
import GAdminUsers from "./GAdminUsers";
import GAdminPlanets from "./GAdminPlanets";

function GAdmin(): JSX.Element {
  const {data} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });
  const match = useRouteMatch();

  return (
    <div className="GAdmin bp3-dark">
      <div className="GAdmin-container">
        
        {data?.currentUser && data.currentUser.admin && <GAdminSidebar/>}
        {(data?.currentUser && data.currentUser.admin) ? <Switch>
          <Route path={`${match.path}/reports`}>
            <GAdminReports/>
          </Route>
          <Route path={`${match.path}/users`}>
            <GAdminUsers/>
          </Route>
          <Route path={`${match.path}/planets`}>
            <GAdminPlanets/>
          </Route>
          <Route path={`${match.path}`}>
            <GAdminHome/>
          </Route>
        </Switch> : <div className="GAdmin-not-allowed">
          <NonIdealState
            icon="error"
            title="403 Forbidden"
            description="You don't have permission to view this page."
          />
        </div>}
      </div>
    </div>
  );
}

export default GAdmin;