import { gql } from "@apollo/client";
import IFileObject from "../../../../types/IFileObject";

export interface ICompleteUploadMutationData {
  completeUpload: IFileObject
}

const completeUploadMutation = gql`
  mutation CompleteUpload($objectId: ID!) {
    completeUpload(objectId: $objectId) {
      id
      finishedUploading
    }
  }
`;

export default completeUploadMutation;