import { useQuery } from "@apollo/client";
import {Alignment, Button, Classes, Navbar, NonIdealState} from "@blueprintjs/core";
import React from "react";
import { Route, Switch, useParams, useRouteMatch } from "react-router-dom";
import getPlanet, { IGetPlanetData } from "../graphql/queries/planets/getPlanet";
import yn from 'yn';
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
  const useRedesign = yn(localStorage.getItem("superSecretSetting.useRedesign"));
  const {planet} = useParams<IPlanetParams>();
  const {loading, data} = useQuery<IGetPlanetData>(getPlanet, {variables: {planet}, errorPolicy: 'all'});

  return (
    <div className="Planet">
      {loading ? <>
        {!useRedesign && <div className={"Planet-header"}>
          <div className={`Planet-header-name-skeleton ${Classes.SKELETON}`}/>
          <div className={`Planet-header-infostrip-skeleton ${Classes.SKELETON}`}/>
        </div>}
        {!useRedesign && <Navbar className="Planet-navbar">
          <div className="Planet-navbar-content">
            <Navbar.Group align={Alignment.LEFT}>
              <Button className={`Planet-navbar-button-skeleton ${Classes.SKELETON}`} outlined={props.home} small={true} icon="home" text="Home"/>
              <Button className={`Planet-navbar-button-skeleton ${Classes.SKELETON}`} outlined={props.home} small={true} icon="home" text="Home"/>
              <Button className={`Planet-navbar-button-skeleton ${Classes.SKELETON}`} outlined={props.home} small={true} icon="home" text="Home"/>
            </Navbar.Group>
          </div>
        </Navbar>}
        <div className={`Planet-contentcontainer Planet-contentcontainer-skeleton ${Classes.SKELETON}`}/>
      </> : (data?.planet ? <>
        {!useRedesign && <div className="Planet-header">
          <div className="Planet-header-name">{data.planet.name}</div>
          <InfoStrip planet={data.planet}/>
        </div>}
        <Switch>
          <Route path={`${match.path}/:component/:subId/:page`}>
            <PlanetContent home={false} planet={data.planet}/>
          </Route>
          <Route path={`${match.path}/:component/:subId`}>
            <PlanetContent home={false} planet={data.planet}/>
          </Route>
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