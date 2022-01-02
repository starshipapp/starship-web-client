import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NonIdealState from "../components/display/NonIdealState";
import IPlanet from "../types/IPlanet";
import Admin from "./admin/Admin";
import ComponentIndex from "./ComponentIndex";

interface IPlanetContentProps {
  home: boolean,
  planet: IPlanet
}

function PlanetContent(props: IPlanetContentProps): JSX.Element {
  const { component, subId, page} = useParams();
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
    icon={faExclamationTriangle}
    title="404"
  >We couldn't find that page in this planet.</NonIdealState>;

  if(component && props.planet.components) {
    const filteredComponents = props.planet.components.filter(value => value.componentId === component);
    if(filteredComponents.length === 1) {
      const thisComponent = ComponentIndex.getComponent(component, filteredComponents[0].type, props.planet, filteredComponents[0].name, subId, page);
      if(thisComponent) {
        currentComponent = thisComponent;
      } else {
        currentComponent = <NonIdealState
          icon={faExclamationTriangle}
          title="Not Implemented"
        >This component has no client implementation and cannot be rendered.</NonIdealState>;
      }
    }
  }

  if(component === "admin" && props.planet) {
    if(props.planet.createdAt) {
      currentComponent = <Admin planet={props.planet} forceStyling={forceStyling} enableStyling={enableStyling} subId={subId ?? "/"}/>;
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
            icon={faExclamationTriangle}
            title="Not Implemented"
          >This component has no client implementation and cannot be rendered.</NonIdealState>;
        }
      }
    }
  }

  return (
    <>
      {props.planet.css && (component !== "admin" || forceStyling === true) && <style>{props.planet.css}</style>}
      {props.planet.components && <div className={"min-h-full w-full overflow-x-hidden m-0 p-0 flex"}>
        {currentComponent}
      </div>}
    </>
  );
}

export default PlanetContent;
