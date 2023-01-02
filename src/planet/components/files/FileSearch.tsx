import { useQuery } from "@apollo/client";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import NonIdealState from "../../../components/display/NonIdealState";
import getSearchForFiles, { IGetSearchForFilesData } from "../../../graphql/queries/components/files/getSearchForFiles";
import IPlanet from "../../../types/IPlanet";
import FileItem from "./FileItem";

interface IFileSearchProps {
  planet: IPlanet
  id: string,
  parentId: string,
  searchText: string,
  onClick: () => void
}

function FileSearch(props: IFileSearchProps): JSX.Element {
  const {data, refetch} = useQuery<IGetSearchForFilesData>(getSearchForFiles, {variables: {componentId: props.id, parent: props.parentId, searchText: props.searchText}});

  return (
    <>
      {data?.searchForFiles && data.searchForFiles.length > 0 && <div>
        {data?.searchForFiles.map((value) => (<FileItem planet={props.planet} onClick={props.onClick} key={value.id} object={value} componentId={props.id} refetch={() => {void refetch();}}/>))}
      </div>}
      {data?.searchForFiles && data.searchForFiles.length === 0 && <NonIdealState title="No results found." icon={faExclamationTriangle} className="mt-4"/>}
    </>
  );
}

export default FileSearch;
