import { useQuery } from "@apollo/client";
import { Route, Routes, useParams } from "react-router-dom";
import getPlanet, { IGetPlanetData } from "../graphql/queries/planets/getPlanet";
import PlanetContent from "./PlanetContent";
import NonIdealState from "../components/display/NonIdealState";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

function Planet(): JSX.Element {
  const {planet} = useParams();
  const {data} = useQuery<IGetPlanetData>(getPlanet, {variables: {planet}, errorPolicy: 'all'});

  return (
    <div className="h-full w-full overflow-x-hidden overflow-y-hidden flex text-black dark:text-white Planet">
      {data?.planet ? <>
        <Routes>
          <Route path=":component/:subId/:page" element={<PlanetContent home={false} planet={data.planet}/>}/>
          <Route path=":component/:subId/*" element={<PlanetContent home={false} planet={data.planet}/>}/>
          <Route path=":component" element={<PlanetContent home={false} planet={data.planet}/>}/>
          <Route path="/" element={<PlanetContent home={true} planet={data.planet}/>}/>
        </Routes>
      </> : <NonIdealState
        title="404"
        icon={faExclamationTriangle}
        className="Planet-404"
      >It looks like this planet doesn't exist.</NonIdealState>}
    </div>
  );
}

export default Planet;
