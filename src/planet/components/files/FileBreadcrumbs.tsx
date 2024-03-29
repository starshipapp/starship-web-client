import { useQuery } from "@apollo/client";
import getBreadcrumbObjects, { IGetBreadcrumbObjectsData } from "../../../graphql/queries/components/files/getBreadcrumbObjects";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../../components/display/Breadcrumbs";
import Breadcrumb from "../../../components/display/Breadcrumb";
import { faFolder, faFolderOpen, faHome } from "@fortawesome/free-solid-svg-icons";
import getIconFromType from "../../../util/getIconFromType";

interface IFileBreadcrumbsProps {
  path: string[],
  planetId: string,
  componentId: string,
  name: string,
  resetSearch: () => void
}

function FileBreadcrumbs(props: IFileBreadcrumbsProps): JSX.Element {
  const {data} = useQuery<IGetBreadcrumbObjectsData>(getBreadcrumbObjects, {variables: {ids: props.path}});
  const array = [...(data?.fileObjectArray ?? [])];
  array.sort((a, b) => props.path.indexOf(a.id) - props.path.indexOf(b.id));

  return (
    <Breadcrumbs className="mr-auto ml-2 my-auto flex-shrink">
      <Link className="link-button" to={`/planet/${props.planetId}/${props.componentId}`}>
        <Breadcrumb
          icon={faHome} 
          active={props.path.length === 1}
        >{props.name}</Breadcrumb>
      </Link>
      {array.map((value, index) => (<Link className="link-button" to={`/planet/${props.planetId}/${props.componentId}/${value.id}`} key={index}>
        <Breadcrumb
          icon={value.type === "folder" ? (index === array.length - 1 ? faFolderOpen : faFolder) : getIconFromType(value.fileType ?? "application/octet-stream")}
          active={index === array.length - 1}
        >{value.name}</Breadcrumb>

      </Link>))}
    </Breadcrumbs> 
  );
}

export default FileBreadcrumbs;
