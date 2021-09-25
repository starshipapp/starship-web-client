import React from "react";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import getSearchForPlanets, { IGetSearchForPlanetsData } from "../graphql/queries/planets/getSearchForPlanets";

interface IPlanetSearchProps {
  searchText: string
}

function PlanetSearch(props: IPlanetSearchProps): JSX.Element {
  const {data, loading} = useQuery<IGetSearchForPlanetsData>(getSearchForPlanets, {variables: {searchText: props.searchText}});

  return (
    <div className="mt-3">
      <div className="font-bold text-2xl mb-2">Search Results</div>
      {!loading && <div className="grid grid-cols-auto-md gap-3">
        {data && data.searchForPlanets.map((value) => (<Link className="link-button" to={`/planet/` + value.id} key={value.id}>
          <div className="h-48 bg-gray-200 dark:bg-gray-800 p-3 rounded-lg flex flex-col">
            <div className="font-bold text-2xl mb-1 overflow-ellipsis whitespace-nowrap overflow-hidden">{value.name}</div>
            <div className="mb-auto">{value.description && value.description}</div>
            <div className="text-gray-700 dark:text-gray-300">{value.followerCount} {value.followerCount === 1 ? "Follower" : "Followers"}</div>
          </div>
        </Link>))}
      </div>}
      {loading && <div className="grid grid-cols-auto-md gap-3">
        <div className={`h-48 bg-gray-200 dark:bg-gray-800 p-3 rounded-lg flex flex-col`}/>
        <div className={`h-48 bg-gray-200 dark:bg-gray-800 p-3 rounded-lg flex flex-col`}/>
        <div className={`h-48 bg-gray-200 dark:bg-gray-800 p-3 rounded-lg flex flex-col`}/>
        <div className={`h-48 bg-gray-200 dark:bg-gray-800 p-3 rounded-lg flex flex-col`}/>
        <div className={`h-48 bg-gray-200 dark:bg-gray-800 p-3 rounded-lg flex flex-col`}/>
        <div className={`h-48 bg-gray-200 dark:bg-gray-800 p-3 rounded-lg flex flex-col`}/>
        <div className={`h-48 bg-gray-200 dark:bg-gray-800 p-3 rounded-lg flex flex-col`}/>
        <div className={`h-48 bg-gray-200 dark:bg-gray-800 p-3 rounded-lg flex flex-col`}/>
        <div className={`h-48 bg-gray-200 dark:bg-gray-800 p-3 rounded-lg flex flex-col`}/>
        <div className={`h-48 bg-gray-200 dark:bg-gray-800 p-3 rounded-lg flex flex-col`}/>
      </div>}
    </div>
  );
}

export default PlanetSearch;