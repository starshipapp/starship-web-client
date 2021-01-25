import { gql } from "@apollo/client";

export interface IDeleteFileObjectMutationData {
  deleteFileObject: boolean
}

const deleteFileObjectMutation = gql`
  mutation DeleteFileObject($objectId: ID!) {
    deleteFileObject(objectId: $objectId)
  }
`;

export default deleteFileObjectMutation;