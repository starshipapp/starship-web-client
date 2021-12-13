import { useQuery } from "@apollo/client";
import getCurrentUser, { IGetCurrentUserData } from "../../graphql/queries/users/getCurrentUser";
import React, { useState } from "react";
import IPlanet from "../../types/IPlanet";
import permissions from "../../util/permissions";
import { Link } from "react-router-dom";
import AdminGeneral from "./AdminGeneral";
import AdminComponent from "./AdminComponents";
import AdminExperimental from "./AdminExperimental";
import AdminMembers from "./AdminMembers";
import isMobile from "../../util/isMobile";
import AdminEmojis from "./AdminEmojis";
import Page from "../../components/layout/Page";
import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import SubPage from "../../components/subpage/SubPage";
import SubPageSidebar from "../../components/subpage/SubPageSidebar";
import NonIdealState from "../../components/display/NonIdealState";
import { faExclamationCircle, faFlask, faPuzzlePiece, faSmile, faUserFriends, faWrench } from "@fortawesome/free-solid-svg-icons";
import MenuItem from "../../components/menu/MenuItem";

interface IAdminProps {
  planet: IPlanet,
  forceStyling: boolean,
  enableStyling: (value: boolean) => void,
  subId: string
}

function Admin(props: IAdminProps): JSX.Element {
  const {data, loading} = useQuery<IGetCurrentUserData>(getCurrentUser);
  const [showSidebar, setSidebar] = useState<boolean>(!isMobile()); 

  const toggleSidebar = function() {
    if(isMobile()) {
      setSidebar(!showSidebar);
    }
  };

  return (
    <> 
      <Page>
        {loading ? <div></div> : data?.currentUser && permissions.checkFullWritePermission(data.currentUser, props.planet) ? <PageContainer>
          <PageHeader>Admin</PageHeader>
          <SubPage>
            <SubPageSidebar>
              <Link onClick={toggleSidebar} className="link-button" to={`/planet/${props.planet.id}/admin`}><MenuItem icon={faWrench}>General</MenuItem></Link>
              <Link onClick={toggleSidebar} className="link-button" to={`/planet/${props.planet.id}/admin/components`}><MenuItem icon={faPuzzlePiece}>Components</MenuItem></Link>
              <Link onClick={toggleSidebar} className="link-button" to={`/planet/${props.planet.id}/admin/members`}><MenuItem icon={faUserFriends}>Members</MenuItem></Link>
              <Link onClick={toggleSidebar} className="link-button" to={`/planet/${props.planet.id}/admin/emojis`}><MenuItem icon={faSmile}>Emojis</MenuItem></Link>
              <Link onClick={toggleSidebar} className="link-button" to={`/planet/${props.planet.id}/admin/experimental`}><MenuItem icon={faFlask}>Experimental</MenuItem></Link>
            </SubPageSidebar>
            <div className="w-full ml-4">
              {props.subId === "experimental" && <AdminExperimental planet={props.planet} forceStyling={props.forceStyling} enableStyling={props.enableStyling}/>}
              {props.subId === "components" && <AdminComponent planet={props.planet}/>}
              {props.subId === "members" && <AdminMembers planet={props.planet}/>}
              {props.subId === "emojis" && <AdminEmojis planet={props.planet}/>}
              {props.subId === "/" && <AdminGeneral planet={props.planet}/>}
            </div>
          </SubPage>
          </PageContainer> : <NonIdealState
            icon={faExclamationCircle}
            title="403"
          >You aren't the admin of this planet.</NonIdealState>}
      </Page>
    </>
  );
}

export default Admin;
