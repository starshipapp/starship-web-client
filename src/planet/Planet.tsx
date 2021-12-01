import { useQuery } from "@apollo/client";
import { Route, Switch, useParams, useRouteMatch } from "react-router-dom";
import getPlanet, { IGetPlanetData } from "../graphql/queries/planets/getPlanet";
import "./css/Planet.css";
import PlanetContent from "./PlanetContent";
import NonIdealState from "../components/display/NonIdealState";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

interface IPlanetParams {
  planet: string
}

interface IPlanetProps {
  home: boolean
}

function Planet(props: IPlanetProps): JSX.Element {
  const match = useRouteMatch();
  const {planet} = useParams<IPlanetParams>();
  const {data} = useQuery<IGetPlanetData>(getPlanet, {variables: {planet}, errorPolicy: 'all'});

  return (
    <div className="h-full w-full overflow-x-hidden overflow-y-hidden flex text-black dark:text-white">
      {data?.planet ? <>
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
        icon={faExclamationTriangle}
        className="Planet-404"
      >It looks like this planet doesn't exist.</NonIdealState>}
    </div>
  );
}

export default Planet;
