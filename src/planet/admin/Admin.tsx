import { useQuery } from "@apollo/client";
import getCurrentUser, { IGetCurrentUserData } from "../../graphql/queries/users/getCurrentUser";
import React from "react";
import IPlanet from "../../types/IPlanet";
import permissions from "../../util/permissions";
import { Menu, MenuItem, NonIdealState } from "@blueprintjs/core";
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";
import AdminGeneral from "./AdminGeneral";
import "./css/Admin.css";
import AdminComponent from "./AdminComponents";
import AdminExperimental from "./AdminExperimental";
import AdminMembers from "./AdminMembers";

interface IAdminProps {
  planet: IPlanet,
  forceStyling: boolean,
  enableStyling: (value: boolean) => void
}

function Admin(props: IAdminProps): JSX.Element {
  const {data, loading} = useQuery<IGetCurrentUserData>(getCurrentUser);
  const match = useRouteMatch();

  return (
    <> 
      <div className="Admin bp3-dark">
        {loading ? <div></div> : data?.currentUser && permissions.checkFullWritePermission(data.currentUser, props.planet) ? <div>
          <h1>Admin</h1>
          <div className="Admin-container">
            <div className="Admin-sidebar">
              <Menu>
                <Link className="link-button" to={`/planet/${props.planet.id}/admin`}><MenuItem icon="wrench" text="General"/></Link>
                <Link className="link-button" to={`/planet/${props.planet.id}/admin/components`}><MenuItem icon="document" text="Components"/></Link>
                <Link className="link-button" to={`/planet/${props.planet.id}/admin/members`}><MenuItem icon="people" text="Members"/></Link>
                <Link className="link-button" to={`/planet/${props.planet.id}/admin/experimental`}><MenuItem icon="lab-test" text="Experimental"/></Link>
              </Menu>
            </div>
            <div className="Admin-main">
              <Switch>
                <Route path={`/planet/${props.planet.id}/admin/experimental`}>
                  <AdminExperimental planet={props.planet} forceStyling={props.forceStyling} enableStyling={props.enableStyling}/>
                </Route>
                <Route path={`/planet/${props.planet.id}/admin/components`}>
                  <AdminComponent planet={props.planet}/>
                </Route>
                <Route path={`/planet/${props.planet.id}/admin/members`}>
                  <AdminMembers planet={props.planet}/>
                </Route>
                <Route path={`/planet/${props.planet.id}/admin`}>
                  <AdminGeneral planet={props.planet}/>
                </Route>
              </Switch>
            </div>
          </div>
        </div> : <div>
          <NonIdealState
            icon="error"
            title="403"
            description="You aren't the admin of this planet."
          />
        </div>}
      </div>
    </>
  );
}

export default Admin;