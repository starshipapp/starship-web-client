import { useQuery } from "@apollo/client";
import {Alignment, Button, Classes, Navbar, NonIdealState} from "@blueprintjs/core";
import { Route, Switch, useParams, useRouteMatch } from "react-router-dom";
import getPlanet, { IGetPlanetData } from "../graphql/queries/planets/getPlanet";
import yn from 'yn';
import "./css/Planet.css";
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
  const {loading, data} = useQuery<IGetPlanetData>(getPlanet, {variables: {planet}, errorPolicy: 'all'});

  return (
    <div className="Planet">
      {loading ? <>
        <div className={`Planet-contentcontainer Planet-contentcontainer-skeleton ${Classes.SKELETON}`}/>
      </> : (data?.planet ? <>
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
