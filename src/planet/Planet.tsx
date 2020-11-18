import { useQuery } from "@apollo/client";
import {NonIdealState} from "@blueprintjs/core";
import React, { useEffect } from "react";
import { Route, Switch, useParams, useRouteMatch } from "react-router-dom";
import getPlanet, { IGetPlanetData } from "../graphql/queries/planets/getPlanet";
import "./css/Planet.css";
import InfoStrip from "./InfoStrip";
import PlanetContent from "./PlanetContent";

interface IPlanetParams {
  planet: string
}

interface IPlanetProps {
  home: boolean
}

function Planet(props: IPlanetProps): JSX.Element {
  const match = useRouteMatch();
  const {planet} = useParams<IPlanetParams>();
  console.log("planet: " + planet);
  const {loading, data} = useQuery<IGetPlanetData>(getPlanet, {variables: {planet}, errorPolicy: 'all'});

  return (
    <div className="Planet">
      {loading ? <></> : (data?.planet ? <>
        <div className="Planet-header">
          <div className="Planet-header-name">{data.planet.name}</div>
          <InfoStrip planet={data.planet}/>
        </div>
        <Switch>
          <Route path={`${match.path}/:component`}>
            <PlanetContent home={false} planet={data.planet}/>
          </Route>
          <Route path={`${match.path}`}>
            <PlanetContent home={true} planet={data.planet}/>
          </Route>
        </Switch>
      </> : <NonIdealState
        title="404"
        icon="warning-sign"
        description="It looks like this planet doesn't exist."
        className="Planet-404"
      />)}
    </div>
  );
}

export default Planet;