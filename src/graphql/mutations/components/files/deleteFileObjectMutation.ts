import { gql } from "@apollo/client";

export interface IDeleteFileObjectMutationData {
  deleteFileObject: boolean
}

const deleteFileObjectMutation = gql`
  mutation DeleteFileObject($objectIds: [ID]!) {
    deleteFileObject(objectIds: $objectIds)
  }
`;

export default deleteFileObjectMutation;