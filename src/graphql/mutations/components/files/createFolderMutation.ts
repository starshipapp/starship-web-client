import { gql } from "@apollo/client";
import IFileObject from "../../../../types/IFileObject";

export interface ICreateFolderMutationData {
  createFolder: IFileObject
}

const createFolderMutation = gql`
  mutation CreateFolder($componentId: ID!, $parent: String!, $name: String!) {
    createFolder(componentId: $componentId, parent: $parent, name: $name) {
      id
      name
      parent {
        id
      }
      path
    }
  }
`;

export default createFolderMutation;