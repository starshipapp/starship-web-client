import { gql } from "@apollo/client";
import IFileObject from "../../../../types/IFileObject";

export interface IRenameObjectMutationData {
  renameObjectMutation: IFileObject
}

const renameObjectMutation = gql`
  mutation RenameObject($objectId: ID!, $name: String!) {
    renameObject(objectId: $objectId, name: $name) {
      id
      name
    }
  }
`;

export default renameObjectMutation;