import { gql } from "@apollo/client";

export interface ICancelUploadMutationData {
  cancelUpload: boolean
}

const cancelUploadMutation = gql`
  mutation CancelUpload($objectId: ID!) {
    cancelUpload(objectId: $objectId)
  }
`;

export default cancelUploadMutation;