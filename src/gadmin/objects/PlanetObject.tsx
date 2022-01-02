import { useQuery } from "@apollo/client";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import Button from "../../components/controls/Button";
import getPlanet, { IGetPlanetData } from "../../graphql/queries/planets/getPlanet";

interface IForumPostObjectProps {
  id: string
}

function PlanetObject(props: IForumPostObjectProps): JSX.Element {
  const {data} = useQuery<IGetPlanetData>(getPlanet, {variables: {planet: props.id}});

  return (
    <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded">
      {data?.planet && <>
        <div className="flex mb-1">
          <FontAwesomeIcon icon={faGlobe}/>
          <h3 className="text-document my-auto font-bold leading-none ml-1">{data.planet.name}</h3>
        </div>
        <div className="mb-2">
          <div className="text-gray-300 dark:text-gray-300">
            {new Date(Number(data.planet.createdAt)).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
        <div>
          <Link className="link-button" to={`/planet/${data.planet.id}`}><Button small>Go To</Button></Link>
        </div>
      </>}
    </div>
  );
}

export default PlanetObject;
