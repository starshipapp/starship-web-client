import { gql } from "@apollo/client";
import IFileComponent from "../../../../types/IFileComponent";

export interface IGetFileComponentData {
  fileComponent: IFileComponent
}

const getFileComponent = gql`
  query GetFileComponent($id: ID!) {
    fileComponent(id: $id) {
      id
      createdAt
      planet {
        id
      }
    }
  }
`;

export default getFileComponent;