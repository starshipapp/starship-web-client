import { useMutation, useQuery } from "@apollo/client";
import { Divider, Intent, Menu, MenuDivider, MenuItem, Position, Tag } from "@blueprintjs/core";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import followMutation, { IFollowMutationData } from "../graphql/mutations/planets/followMutation";
import getPlanet, { IGetPlanetData } from "../graphql/queries/planets/getPlanet";
import getCurrentUser, { IGetCurrentUserData } from "../graphql/queries/users/getCurrentUser";
import ComponentIndex from "../planet/ComponentIndex";
import { GlobalToaster } from "../util/GlobalToaster";
import permissions from "../util/permissions";
import PlanetSwitcher from "./PlanetSwitcher";
import "./css/PlanetSidebar.css";
import addComponentMutation, { IAddComponentMutationData } from "../graphql/mutations/planets/addComponentMutation";
import ReportDialog from "../planet/ReportDialog";
import ModTools from "../planet/ModTools";
import { reportObjectType } from "../util/reportTypes";

interface IPlanetSidebarProps {
  planet: string,
  component: string,
  home: boolean,
  toggleHidden: () => void
}

function PlanetSidebar(props: IPlanetSidebarProps): JSX.Element {
  const { client, loading: userLoading, data: userData, refetch: userRefetch } = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });  
  const { loading, data } = useQuery<IGetPlanetData>(getPlanet, {variables: {planet: props.planet}, errorPolicy: 'all'});
  const [follow] = useMutation<IFollowMutationData>(followMutation);
  const [componentName, setComponentName] = useState<string>("");
  const [addComponent] = useMutation<IAddComponentMutationData>(addComponentMutation);
  const [showReport, setReport] = useState<boolean>(false);
  const [showTools, setTools] = useState<boolean>(false);

  if(loading) {
    return (<></>);
  } else {
    return (<>
      {data && <>
        <ModTools
          isOpen={showTools}
          onClose={() => setTools(false)}
          planet={data.planet}
        />
        <ReportDialog
          isOpen={showReport} 
          onClose={() => setReport(false)}
          objectId={data.planet.id}
          objectType={reportObjectType.PLANET}
          userId={data.planet.owner?.id ?? ""}
        />
        <MenuItem 
          icon={data.planet.verified ? "tick-circle" : (data.planet.partnered ? "unresolve" : (data.planet.featured ? "star" : "globe-network"))} 
          text={data.planet.name}
        >
          {userData?.currentUser && <div className="PlanetSidebar-switcher">
            {<MenuItem
              icon="flag"
              text={`Report ${data.planet.name ?? "unknown"}`}
              intent={Intent.DANGER}
              onClick={() => setReport(true)}
            />}
            {permissions.checkAdminPermission(userData.currentUser) && <MenuDivider title="ADMIN TOOLS"/>}
            {permissions.checkAdminPermission(userData.currentUser) && <MenuItem
              icon="wrench"
              text="Mod Tools"
              onClick={() => setTools(true)}
            />}
            <PlanetSwitcher toggleHidden={props.toggleHidden}/>
          </div>}
        </MenuItem>
        {userData?.currentUser && <MenuItem
          icon={(userData?.currentUser.following && userData?.currentUser.following.some(e => e.id === props.planet) ) ? "minus" : "plus"}
          text={(userData?.currentUser.following && userData?.currentUser.following.some(e => e.id === props.planet) ) ? "Unfollow" : "Follow"}
          labelElement={<Tag className="MainSidebar-notif-icon">{data.planet.followerCount}</Tag>}
          onClick={() => {
            follow({variables: {planetId: props.planet}}).then(() => {
              void userRefetch();
            }).catch((error: Error) => {
              GlobalToaster.show({message: error.message, intent: Intent.DANGER});
            });
          }}
        />}
        {userData?.currentUser && permissions.checkFullWritePermission(userData.currentUser, data.planet) && <Link to={`/planet/${props.planet}/admin`}><MenuItem
          text="Admin"
          intent={Intent.DANGER}
          icon="wrench"
        /></Link>}
        <Divider/>
        <Link onClick={() => props.toggleHidden()} className="link-button" to={`/planet/${props.planet}`}><MenuItem icon="home" text="Home"/></Link>
        {data.planet.components && data.planet.components.map((value) => (<Link className="link-button" onClick={() => props.toggleHidden()} to={`/planet/${props.planet}/${value.componentId}`}>
          <MenuItem
            className="bp3-minimal"
            icon={ComponentIndex.ComponentDataTypes[value.type].icon}
            text={value.name}
            disabled={props.component !== undefined && props.component === value.componentId}
            key={value.componentId}
          />
        </Link>))}
        {userData?.currentUser && permissions.checkFullWritePermission(userData.currentUser, data.planet) && <MenuItem
          icon="plus"
          text="Add Component"
        >
          <div className="PlanetSidebar-add-content">
            <input className="bp3-input" placeholder="Name" value={componentName} onChange={(e) => setComponentName(e.target.value)}/>
            <Menu>
              {Object.values(ComponentIndex.ComponentDataTypes).map((value) => (<MenuItem text={"Create new " + value.friendlyName} key={value.name} icon={value.icon} onClick={() => {
                if(componentName === "") {
                  GlobalToaster.show({message: "Your component must have a name.", intent: Intent.DANGER});
                  return;
                }
                addComponent({variables: {planetId: props.planet, name: componentName, type: value.name}}).then((value) => {
                  if(value.data?.addComponent.id) {
                    GlobalToaster.show({message: `Successfully added ${componentName}.`, intent: Intent.SUCCESS});
                    props.toggleHidden();
                  }
                }).catch((error: Error) => {
                  GlobalToaster.show({message: error.message, intent: Intent.DANGER});
                });
              }}/>))}
            </Menu>
          </div>
        </MenuItem>}
      </>}
    </>);
  }
}

export default PlanetSidebar;