import { gql } from "@apollo/client";
import IFileObject from "../../../../types/IFileObject";

export interface IGetFoldersData {
  folders: IFileObject[]
}

const getFolders = gql`
  query GetFolders($componentId: ID!, $parent: String!) {
    folders(componentId: $componentId, parent: $parent) {
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

export default getFolders;