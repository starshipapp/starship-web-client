import { gql } from "@apollo/client";
import IFileObject from "../../../../types/IFileObject";

export interface IGetFileObjectData {
  fileObject: IFileObject
}

const getFileObject = gql`
  query GetFileObject($id: ID!) {
    fileObject(id: $id) {
      id
      path
      parent {
        id
      }
      name
      owner {
        id
        username
      }
      type
      createdAt
      component {
        id
      }
      planet {
        id
      }
      size
      fileType
      finishedUploading
    }
  }
`;

export default getFileObject;