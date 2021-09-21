import { useMutation, useQuery } from "@apollo/client";
import { Intent as bpIntent } from "@blueprintjs/core";
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
import MenuItem from "../components/menu/MenuItem";
import { faCheckCircle, faFlag, faGlobe, faHome, faLink, faMinus, faPlus, faStar, faWrench } from "@fortawesome/free-solid-svg-icons";
import MenuCollapsed from "../components/menu/MenuCollapsed";
import Intent from "../components/Intent";
import Popover from "../components/overlays/Popover";
import Textbox from "../components/input/Textbox";
import MenuHeader from "../components/menu/MenuHeader";
import PopperPlacement from "../components/PopperPlacement";
import Tag from "../components/display/Tag";
import Divider from "../components/display/Divider";

interface IPlanetSidebarProps {
  planet: string,
  component: string,
  home: boolean,
  toggleHidden: () => void
}

function PlanetSidebar(props: IPlanetSidebarProps): JSX.Element {
  const { data: userData, refetch: userRefetch } = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });  
  const { loading, data } = useQuery<IGetPlanetData>(getPlanet, {variables: {planet: props.planet}, errorPolicy: 'all'});
  const [follow] = useMutation<IFollowMutationData>(followMutation);
  const [componentName, setComponentName] = useState<string>("");
  const [addComponent] = useMutation<IAddComponentMutationData>(addComponentMutation);
  const [showReport, setReport] = useState<boolean>(false);
  const [showTools, setTools] = useState<boolean>(false);
  const [showAddComponent, setAddComponent] = useState<boolean>(false);

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
        <MenuCollapsed
          icon={data.planet.verified ? faCheckCircle : (data.planet.partnered ? faLink : (data.planet.featured ? faStar : faGlobe))} 
          title={data.planet.name ?? ""}
        >
          {userData?.currentUser && <div>
            {<MenuItem
              icon={faFlag}
              intent={Intent.DANGER}
              onClick={() => setReport(true)}
            >Report {data.planet.name ?? "unknown"}</MenuItem>}
            {permissions.checkAdminPermission(userData.currentUser) && <MenuHeader>Admin Tools</MenuHeader>}
            {permissions.checkAdminPermission(userData.currentUser) && <MenuItem
              icon={faWrench}
              onClick={() => setTools(true)}
            >Mod Tools</MenuItem>}
            <PlanetSwitcher toggleHidden={props.toggleHidden}/>
          </div>}
        </MenuCollapsed>
        {userData?.currentUser && <MenuItem
          icon={(userData?.currentUser.following && userData?.currentUser.following.some(e => e.id === props.planet) ) ? faMinus : faPlus}
          rightElement={<Tag>{data.planet.followerCount}</Tag>}
          onClick={() => {
            follow({variables: {planetId: props.planet}}).then(() => {
              void userRefetch();
            }).catch((error: Error) => {
              GlobalToaster.show({message: error.message, intent: bpIntent.DANGER});
            });
          }}
        >{(userData?.currentUser.following && userData?.currentUser.following.some(e => e.id === props.planet) ) ? "Unfollow" : "Follow"}</MenuItem>}
        {userData?.currentUser && permissions.checkFullWritePermission(userData.currentUser, data.planet) && <Link className="link-button" to={`/planet/${props.planet}/admin`}><MenuItem
          intent={Intent.DANGER}
          icon={faWrench}
        >Admin</MenuItem></Link>}
        <Divider/>
        <Link onClick={() => props.toggleHidden()} className="link-button" to={`/planet/${props.planet}`}><MenuItem icon={faHome}>Home</MenuItem></Link>
        {data.planet.components && data.planet.components.map((value) => (<Link className="link-button" onClick={() => props.toggleHidden()} to={`/planet/${props.planet}/${value.componentId}`}>
          <MenuItem
            icon={ComponentIndex.ComponentDataTypes[value.type].icon}
            disabled={props.component !== undefined && props.component === value.componentId}
            key={value.componentId}
          >{value.name}</MenuItem>
        </Link>))}
        {userData?.currentUser && permissions.checkFullWritePermission(userData.currentUser, data.planet) && <>
          <Popover
            popoverTarget={<MenuItem icon={faPlus} onClick={() => setAddComponent(true)}>Add Component</MenuItem>}
            open={showAddComponent}
            onClose={() => setAddComponent(false)}
            fullWidth
            placement={PopperPlacement.right}
          >
            <Textbox
              placeholder="Name"
              value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
            />
            {Object.values(ComponentIndex.ComponentDataTypes).map((value) => (<MenuItem key={value.name} icon={value.icon} onClick={() => {
                if(componentName === "") {
                  GlobalToaster.show({message: "Your component must have a name.", intent: bpIntent.DANGER});
                  return;
                }
                addComponent({variables: {planetId: props.planet, name: componentName, type: value.name}}).then((value) => {
                  if(value.data?.addComponent.id) {
                    GlobalToaster.show({message: `Successfully added ${componentName}.`, intent: bpIntent.SUCCESS});
                    props.toggleHidden();
                  }
                }).catch((error: Error) => {
                  GlobalToaster.show({message: error.message, intent: bpIntent.DANGER});
                });
              }}>{"Create new " + value.friendlyName}</MenuItem>))}
          </Popover>
        </>}
      </>}
    </>);
  }
}

export default PlanetSidebar;