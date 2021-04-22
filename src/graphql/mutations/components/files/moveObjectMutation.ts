import { gql } from "@apollo/client";
import IFileObject from "../../../../types/IFileObject";

export interface IMoveObjectMutationData {
  moveObject: IFileObject
}

const moveObjectMutation = gql`
  mutation MoveObject($objectIds: [ID]!, $parent: String!) {
    moveObject(objectIds: $objectIds, parent: $parent) {
      id
      path
      parent {
        id
      }
    }
  }
`;

export default moveObjectMutation;