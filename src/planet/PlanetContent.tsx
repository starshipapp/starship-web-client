import { useMutation, useQuery } from "@apollo/client";
import { Alignment, Button, Intent, Menu, MenuItem, Navbar, NonIdealState, Popover } from "@blueprintjs/core";
import React, { useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import addComponentMutation, { IAddComponentMutationData } from "../graphql/mutations/planets/addComponentMutation";
import getCurrentUser, { IGetCurrentUserData } from "../graphql/queries/users/getCurrentUser";
import IPlanet from "../types/IPlanet";
import IUser from "../types/IUser";
import { GlobalToaster } from "../util/GlobalToaster";
import permissions from "../util/permissions";
import ComponentIndex from "./ComponentIndex";
import "./css/Planet.css";

interface IPlanetContentParams {
  planet: string,
  component?: string,
}

interface IPlanetContentProps {
  home: boolean,
  planet: IPlanet
}

function PlanetContent(props: IPlanetContentProps): JSX.Element {
  const {planet, component} = useParams<IPlanetContentParams>();
  const {data: userData, loading: userLoading} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });
  const [componentName, setComponentName] = useState<string>("");
  const [addComponent] = useMutation<IAddComponentMutationData>(addComponentMutation);
  const history = useHistory();

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
      const thisComponent = ComponentIndex.getComponent(component, filteredComponents[0].type, props.planet, filteredComponents[0].name);
      if(thisComponent) {
        currentComponent = thisComponent;
      }
    }
  }

  /* if(props.admin && this.props.planet[0]) {
    if(this.props.planet[0].createdAt) {
      currentComponent = <Admin planet={this.props.planet[0]}/>;
    }
  }*/

  if(props.home) {
    if(props.planet) {
      if(props.planet.homeComponent) {
        const thisComponent = ComponentIndex.getComponent(props.planet.homeComponent.componentId, props.planet.homeComponent.type, props.planet, "Home");
        if(thisComponent) {
          currentComponent = thisComponent;
        }
      }
    }
  }

  return (
    <>
      <Navbar className="Planet-navbar">
        <div className="Planet-navbar-content">
          <Navbar.Group align={Alignment.LEFT}>
            <Link to={`/planet/${planet}`}> <Button className="bp3-minimal" outlined={props.home} icon="home" text="Home"/> </Link>
            {props.planet.components && props.planet.components.map((value) => (<Link to={`/planet/${planet}/${value.componentId}`}>
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