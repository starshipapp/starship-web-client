import React from "react";
import { useQuery } from "@apollo/client";
import { Classes, Text } from "@blueprintjs/core";
import { Link } from "react-router-dom";
import getSearchForPlanets, { IGetSearchForPlanetsData } from "../graphql/queries/planets/getSearchForPlanets";

interface IPlanetSearchProps {
  searchText: string
}

function PlanetSearch(props: IPlanetSearchProps): JSX.Element {
  const {data, loading} = useQuery<IGetSearchForPlanetsData>(getSearchForPlanets, {variables: {searchText: props.searchText}});

  return (
    <div className="Home-featured">
      <div className="Home-featured-header">Search Results</div>
      {!loading && <div className="Home-featured-list">
        {data && data.searchForPlanets.map((value) => (<Link className="link-button" to={`/planet/` + value.id} key={value.id}>
          <div className="Home-featured-item">
            <Text className="Home-featured-name">{value.name}</Text>
            <Text className="Home-featured-description">{value.description && value.description} </Text>
            <div className="Home-featured-followers">{value.followerCount} {value.followerCount === 1 ? "Follower" : "Followers"}</div>
          </div>
        </Link>))}
      </div>}
      {loading && <div className="Home-featured-list">
        <div className={`Home-featured-item ${Classes.SKELETON}`}/>
        <div className={`Home-featured-item ${Classes.SKELETON}`}/>
        <div className={`Home-featured-item ${Classes.SKELETON}`}/>
        <div className={`Home-featured-item ${Classes.SKELETON}`}/>
        <div className={`Home-featured-item ${Classes.SKELETON}`}/>
        <div className={`Home-featured-item ${Classes.SKELETON}`}/>
        <div className={`Home-featured-item ${Classes.SKELETON}`}/>
        <div className={`Home-featured-item ${Classes.SKELETON}`}/>
        <div className={`Home-featured-item ${Classes.SKELETON}`}/>
        <div className={`Home-featured-item ${Classes.SKELETON}`}/>
      </div>}
    </div>
  );
}

export default PlanetSearch;