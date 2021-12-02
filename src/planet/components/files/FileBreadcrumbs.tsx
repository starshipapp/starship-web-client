import { useQuery } from "@apollo/client";
import getBreadcrumbObjects, { IGetBreadcrumbObjectsData } from "../../../graphql/queries/components/files/getBreadcrumbObjects";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../../components/display/Breadcrumbs";
import Breadcrumb from "../../../components/display/Breadcrumb";
import { faFile, faFolder, faFolderOpen, faHome } from "@fortawesome/free-solid-svg-icons";

interface IFileBreadcrumbsProps {
  path: string[],
  planetId: string,
  componentId: string,
  name: string,
  resetSearch: () => void
}

function FileBreadcrumbs(props: IFileBreadcrumbsProps): JSX.Element {
  const {data} = useQuery<IGetBreadcrumbObjectsData>(getBreadcrumbObjects, {variables: {ids: props.path}});
  const array = [...(data?.fileObjectArray ?? [])].reverse();

  return (
    <Breadcrumbs className="mr-auto ml-2 my-auto">
      <Link className="link-button" to={`/planet/${props.planetId}/${props.componentId}`}>
        <Breadcrumb
          icon={faHome} 
          active={props.path.length === 1}
        >Home</Breadcrumb>
      </Link>
      {array.map((value, index) => (<Link className="link-button" to={`/planet/${props.planetId}/${props.componentId}/${value.id}`} key={index}>
        <Breadcrumb
          icon={value.type === "folder" ? (index === array.length - 1 ? faFolderOpen : faFolder) : faFile} 
          active={index === array.length - 1}
        >{value.name}</Breadcrumb>

      </Link>))}
    </Breadcrumbs> 
  );
}

export default FileBreadcrumbs;
