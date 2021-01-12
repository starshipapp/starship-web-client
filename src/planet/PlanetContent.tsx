import { useMutation, useQuery } from "@apollo/client";
import { Alignment, Button, Intent, Menu, MenuItem, Navbar, NonIdealState, Popover } from "@blueprintjs/core";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import addComponentMutation, { IAddComponentMutationData } from "../graphql/mutations/planets/addComponentMutation";
import getCurrentUser, { IGetCurrentUserData } from "../graphql/queries/users/getCurrentUser";
import IPlanet from "../types/IPlanet";
import IUser from "../types/IUser";
import { GlobalToaster } from "../util/GlobalToaster";
import permissions from "../util/permissions";
import Admin from "./admin/Admin";
import ComponentIndex from "./ComponentIndex";
import "./css/Planet.css";

interface IPlanetContentParams {
  planet: string,
  component?: string,
  subId?: string,
  page?: string
}

interface IPlanetContentProps {
  home: boolean,
  planet: IPlanet
}

function PlanetContent(props: IPlanetContentProps): JSX.Element {
  const {planet, component, subId, page} = useParams<IPlanetContentParams>();
  const {data: userData, loading: userLoading} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });
  const [componentName, setComponentName] = useState<string>("");
  const [addComponent] = useMutation<IAddComponentMutationData>(addComponentMutation);
  const [forceStyling, enableStyling] = useState<boolean>(false);

  useEffect(() => {
    if(component && props.planet.components) {
      const filteredComponents = props.planet.components.filter(value => value.componentId === component);
      if(filteredComponents[0]) {
        document.title = `${filteredComponents[0].name} - ${props.planet.name as unknown as string} | starship`;
      } else if(component === "admin") {
        document.title = `Admin - ${props.planet.name as unknown as string} | starship`;
      } else {
        document.title = `404 - ${props.planet.name as unknown as string} | starship`;
      }
    } else {
      document.title = `${props.planet.name as unknown as string} | starship`;
    }
  });

  //
  // really long component determining thing
  //
  let currentComponent = <NonIdealState
    icon="error"
    title="404"
    description="We couldn't find that page in this planet."
  />;

  if(component && props.planet.components) {
    const filteredComponents = props.planet.components.filter(value => value.componentId === component);
    if(filteredComponents.length === 1) {
      const thisComponent = ComponentIndex.getComponent(component, filteredComponents[0].type, props.planet, filteredComponents[0].name, subId, page);
      if(thisComponent) {
        currentComponent = thisComponent;
      } else {
        currentComponent = <NonIdealState
          icon="error"
          title="Not Implemented"
          description="This component has no client implementation and cannot be rendered."
        />;
      }
    }
  }

  if(component === "admin" && props.planet) {
    if(props.planet.createdAt) {
      currentComponent = <Admin planet={props.planet} forceStyling={forceStyling} enableStyling={enableStyling}/>;
    }
  }

  if(props.home) {
    if(props.planet) {
      if(props.planet.homeComponent) {
        const thisComponent = ComponentIndex.getComponent(props.planet.homeComponent.componentId, props.planet.homeComponent.type, props.planet, "Home");
        if(thisComponent) {
          currentComponent = thisComponent;
        } else {
          currentComponent = <NonIdealState
            icon="error"
            title="Not Implemented"
            description="This component has no client implementation and cannot be rendered."
          />;
        }
      }
    }
  }

  return (
    <>
      {props.planet.css && (component !== "admin" || forceStyling === true) && <style>{props.planet.css}</style>}
      <Navbar className="Planet-navbar">
        <div className="Planet-navbar-content">
          <Navbar.Group align={Alignment.LEFT}>
            <Link className="link-button" to={`/planet/${planet}`}> <Button className="bp3-minimal" outlined={props.home} icon="home" text="Home"/> </Link>
            {props.planet.components && props.planet.components.map((value) => (<Link className="link-button" to={`/planet/${planet}/${value.componentId}`}>
              <Button
                className="bp3-minimal"
                icon={ComponentIndex.ComponentDataTypes[value.type].icon}
                text={value.name}
                outlined={component !== undefined && component === value.componentId}
                key={value.componentId}
              />
            </Link>))}
            {!userLoading && props.planet.owner && permissions.checkFullWritePermission(userData?.currentUser as IUser, props.planet) && <Popover>
              <Button className="bp3-minimal" icon="plus"/>
              <div className="Planet-navbar-add-content">
                <input className="bp3-input" placeholder="name" value={componentName} onChange={(e) => setComponentName(e.target.value)}/>
                <Menu>
                  {Object.values(ComponentIndex.ComponentDataTypes).map((value) => (<MenuItem text={"Create new " + value.friendlyName} key={value.name} icon={value.icon} onClick={() => {
                    addComponent({variables: {planetId: planet, name: componentName, type: value.name}}).then((value) => {
                      if(value.data?.addComponent.id) {
                        GlobalToaster.show({message: `Successfully added ${componentName}.`, intent: Intent.SUCCESS});
                      }
                    }).catch((error: Error) => {
                      GlobalToaster.show({message: error.message, intent: Intent.DANGER});
                    });
                  }}/>))}
                </Menu>
              </div>
            </Popover>}
          </Navbar.Group>
        </div>
      </Navbar>
      {props.planet.components && <div className="Planet-contentcontainer">
        {currentComponent}
      </div>}
    </>
  );
}

export default PlanetContent;