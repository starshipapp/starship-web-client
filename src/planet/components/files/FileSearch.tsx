import { useQuery } from "@apollo/client";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import NonIdealState from "../../../components/display/NonIdealState";
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
      {!props.useLists && data?.searchForFiles && data.searchForFiles.length > 0 && <div className="grid grid-cols-auto-xs w-full p-2">
        {data?.searchForFiles.map((value) => (<FileButton planet={props.planet} onClick={props.onClick} key={value.id} object={value} componentId={props.id} refetch={() => {void refetch();}}/>))}
      </div>}
      {props.useLists && data?.searchForFiles && data.searchForFiles.length > 0 &&<div>
        {data?.searchForFiles.map((value) => (<FileListButton planet={props.planet} onClick={props.onClick} key={value.id} object={value} componentId={props.id} refetch={() => {void refetch();}}/>))}
      </div>}
      {data?.searchForFiles && data.searchForFiles.length === 0 && <NonIdealState title="No results found." icon={faExclamationTriangle} className="mt-4"/>}
    </>
  );
}

export default FileSearch;
