import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { Link } from "react-router-dom";
import followMutation, { IFollowMutationData } from "../graphql/mutations/planets/followMutation";
import getPlanet, { IGetPlanetData } from "../graphql/queries/planets/getPlanet";
import getCurrentUser, { IGetCurrentUserData } from "../graphql/queries/users/getCurrentUser";
import ComponentIndex, { getComponentQualityTag } from "../planet/ComponentIndex";
import permissions from "../util/permissions";
import PlanetSwitcher from "./PlanetSwitcher";
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
import Toasts from "../components/display/Toasts";
import Dialog from "../components/dialog/Dialog";
import DialogBody from "../components/dialog/DialogBody";
import DialogHeader from "../components/dialog/DialogHeader";
import Option from "../components/controls/Option";
import Label from "../components/text/Label";
import Button from "../components/controls/Button";

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
  const [component, setComponent] = useState<string | null>(null);

  if(loading) {
    return (<></>);
  } else {
    return (<>
      {data?.planet && <>
        <ModTools
          isOpen={showTools}
          onClose={() => setTools(false)}
          planet={data.planet}
        />
        {data.planet.id && <ReportDialog
          isOpen={showReport} 
          onClose={() => setReport(false)}
          objectId={data.planet.id}
          objectType={reportObjectType.PLANET}
          userId={data.planet.owner?.id ?? ""}
        />}
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
              Toasts.danger(error.message);
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
          <MenuItem icon={faPlus} onClick={() => setAddComponent(true)}>Add Component</MenuItem>
          <Dialog
            open={showAddComponent}
            onClose={() => {
              setComponent(null);
              setComponentName("");
              setAddComponent(false);
            }}
          >
            <DialogBody>
              <DialogHeader>Add Component</DialogHeader>
              <Label className="mt-1">Name your component:</Label>
              <Textbox
                placeholder="Name"
                value={componentName}
                onChange={(e) => setComponentName(e.target.value)}
                className="mb-3"
              />
              <Label>Select a component type: </Label>
              {Object.values(ComponentIndex.ComponentDataTypes).map((value) => (<Option
                icon={value.icon}
                checked={component === value.name}
                onClick={() => setComponent(value.name)}
              >
                <span>{value.friendlyName}</span>
                {getComponentQualityTag(value.quality)}
              </Option>))}
              <Button
                className="ml-auto mt-2"
                onClick={() => {
                  if(componentName === "") {
                    Toasts.danger("Component name cannot be empty.");
                    return;
                  }
                  if(!component) {
                    Toasts.danger("Please select a component type.");
                  }
                  addComponent({variables: {planetId: props.planet, name: componentName, type: component}}).then((value) => {
                    if(value.data?.addComponent.id) {
                      Toasts.success(`${componentName} added successfully.`);
                      props.toggleHidden();
                    }
                  }).catch((error: Error) => {
                    Toasts.danger(error.message);
                  });

                  setComponent(null);
                  setComponentName("");
                  setAddComponent(false);
                }}
                disabled={!component || componentName === ""}
              >Add {component ? ComponentIndex.ComponentDataTypes[component].friendlyName : "Component"}</Button>
            </DialogBody>
          </Dialog>
        </>}
      </>}
    </>);
  }
}

export default PlanetSidebar;
