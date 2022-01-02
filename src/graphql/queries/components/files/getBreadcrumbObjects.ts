import { gql } from "@apollo/client";
import IFileObject from "../../../../types/IFileObject";

export interface IGetBreadcrumbObjectsData {
  fileObjectArray: IFileObject[]
}

const getBreadcrumbObjects = gql`
  query GetBreadcrumbObjects($ids: [ID]!) {
    fileObjectArray(ids: $ids) {
      id
      name
      type
      fileType
    }
  }
`;

export default getBreadcrumbObjects;
