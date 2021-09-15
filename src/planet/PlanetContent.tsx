import { useMutation, useQuery } from "@apollo/client";
import { Alignment, Button, Intent, Menu, MenuItem, Navbar, NonIdealState, Popover, Position } from "@blueprintjs/core";
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
import yn from 'yn';
import PlanetSidebar from "../sidebar/PlanetSidebar";

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
      {props.planet.components && <div className={"Planet-contentcontainer"}>
        {currentComponent}
      </div>}
    </>
  );
}

export default PlanetContent;
