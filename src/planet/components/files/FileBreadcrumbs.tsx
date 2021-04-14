import React from "react";
import { Breadcrumb, Breadcrumbs, IBreadcrumbProps } from "@blueprintjs/core";
import { useQuery } from "@apollo/client";
import getBreadcrumbObjects, { IGetBreadcrumbObjectsData } from "../../../graphql/queries/components/files/getBreadcrumbObjects";
import { useHistory } from "react-router-dom";

interface IFileBreadcrumbsProps {
  path: string[],
  planetId: string,
  componentId: string,
  resetSearch: () => void
}

function FileBreadcrumbs(props: IFileBreadcrumbsProps): JSX.Element {
  const {data} = useQuery<IGetBreadcrumbObjectsData>(getBreadcrumbObjects, {variables: {ids: props.path}});
  const history = useHistory();
  const propsRef = props;

  const items: IBreadcrumbProps[] = [
    {text: "Root", current: (props.path.length === 1), icon: "home", onClick: () => {history.push(`/planet/${props.planetId}/${props.componentId}`); propsRef.resetSearch();}}
  ];

  if(data?.fileObjectArray) {
    const array = [...data.fileObjectArray]; 
    array.sort((a, b) => props.path.indexOf(a.id) - props.path.indexOf(b.id));
    array.map((value, index) => {items.push({current: (index === array.length - 1), text: value.name ?? "", icon: (value.type === "folder" ? "folder-close" : "document"), onClick: () => history.push(`/planet/${props.planetId}/${props.componentId}/${value.id}`)}); return false;});
  }

  const breadcrumbRenderer = function ({text, ...props}: IBreadcrumbProps) {
    return <Breadcrumb onClick={(e) => {e.preventDefault(); e.stopPropagation(); propsRef.resetSearch();}} className="FilesComponent-breadcrumb" {...props}>{text}</Breadcrumb>;
  };

  return (
    <Breadcrumbs
      className="FilesComponent-breadcrumbs"
      currentBreadcrumbRenderer={breadcrumbRenderer}
      items={items}
    />
  );
}

export default FileBreadcrumbs;