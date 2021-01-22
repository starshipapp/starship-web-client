import { gql } from "@apollo/client";

export interface IDeleteFileObjectMutationnData {
  deleteFileObject: boolean
}

const deleteFileObjectMutation = gql`
  mutation DeleteFileObject($objectId: ID!) {
    deleteFileObject(objectId: $objectId)
  }
`;

export default deleteFileObjectMutation;