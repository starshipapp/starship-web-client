import { gql } from "@apollo/client";
import IFileObject from "../../../../types/IFileObject";

export interface IGetFilesData {
  files: IFileObject[]
}

const getFiles = gql`
  query GetFiles($componentId: ID!, $parent: String!) {
    files(componentId: $componentId, parent: $parent) {
      id,
      path,
      name,
      owner {
        id
      }
      createdAt
      type
      fileType
      finishedUploading
    }
  }
`;

export default getFiles;