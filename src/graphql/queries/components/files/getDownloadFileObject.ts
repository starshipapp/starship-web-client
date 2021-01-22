import { gql } from "@apollo/client";

export interface IGetDownloadFileObjectData {
  downloadFileObject: string
}

const getDownloadFileObject = gql`
  query GetDownloadFileObject($fileId: ID!) {
    downloadFileObject(fileId: $fileId)
  }
`;

export default getDownloadFileObject;