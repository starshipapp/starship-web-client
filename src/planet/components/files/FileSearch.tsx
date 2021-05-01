import { useQuery } from "@apollo/client";
import { NonIdealState } from "@blueprintjs/core";
import React from "react";
import getSearchForFiles, { IGetSearchForFilesData } from "../../../graphql/queries/components/files/getSearchForFiles";
import IPlanet from "../../../types/IPlanet";
import FileButton from "./FileButton";
import FileListButton from "./FileListButton";

interface IFileSearchProps {
  planet: IPlanet
  id: string,
  parentId: string,
  useLists: boolean,
  searchText: string,
  onClick: () => void
}

function FileSearch(props: IFileSearchProps): JSX.Element {
  const {data, refetch} = useQuery<IGetSearchForFilesData>(getSearchForFiles, {variables: {componentId: props.id, parent: props.parentId, searchText: props.searchText}});

  return (
    <>
      {!props.useLists && data?.searchForFiles && data.searchForFiles.length > 0 && <div className="FilesComponent-button-container">
        {data?.searchForFiles.map((value) => (<FileButton planet={props.planet} onClick={props.onClick} key={value.id} object={value} componentId={props.id} refetch={() => {void refetch();}}/>))}
      </div>}
      {props.useLists && data?.searchForFiles && data.searchForFiles.length > 0 &&<div className="FilesComponent-list-table">
        {data?.searchForFiles.map((value) => (<FileListButton planet={props.planet} onClick={props.onClick} key={value.id} object={value} componentId={props.id} refetch={() => {void refetch();}}/>))}
      </div>}
      {data?.searchForFiles && data.searchForFiles.length === 0 && <NonIdealState title="No results found." icon="warning-sign"/>}
    </>
  );
}

export default FileSearch;