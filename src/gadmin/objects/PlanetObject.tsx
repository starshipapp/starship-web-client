import { useQuery } from "@apollo/client";
import { Button, Card, Icon } from "@blueprintjs/core";
import React from "react";
import { Link } from "react-router-dom";
import getPlanet, { IGetPlanetData } from "../../graphql/queries/planets/getPlanet";

interface IForumPostObjectProps {
  id: string
}

function PlanetObject(props: IForumPostObjectProps): JSX.Element {
  const {data} = useQuery<IGetPlanetData>(getPlanet, {variables: {planet: props.id}});

  return (
    <Card className="Report-object-card">
      {data?.planet && <>
        <div className="Report-object-card-header">
          <Icon icon="globe-network"/>
          <h3 className="Report-object-card-name">{data.planet.name}</h3>
        </div>
        <div className="Report-object-card-details">
          <div className="Report-object-card-date">
            {new Date(Number(data.planet.createdAt)).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
        <div className="Report-object-card-actions">
          <Link className="link-button" to={`/planet/${data.planet.id}`}><Button text="Go To"/></Link>
        </div>
      </>}
    </Card>
  );
}

export default PlanetObject;