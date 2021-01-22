import { gql } from "@apollo/client";

export interface IGetDownloadFolderObjectData {
  downloadFolderObject: string[]
}

const getDownloadFolderObject = gql`
  query GetDownloadFolderObject($folderId: ID!) {
    downloadFolderObject(folderId: $folderId)
  }
`;

export default getDownloadFolderObject;