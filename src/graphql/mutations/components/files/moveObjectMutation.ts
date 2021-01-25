import { gql } from "@apollo/client";
import IFileObject from "../../../../types/IFileObject";

export interface IMoveObjectMutationData {
  moveObject: IFileObject
}

const moveObjectMutation = gql`
  mutation MoveObject($objectId: ID!, $parent: String!) {
    moveObject(objectId: $objectId, parent: $parent) {
      id
      path
      parent {
        id
      }
    }
  }
`;

export default moveObjectMutation;