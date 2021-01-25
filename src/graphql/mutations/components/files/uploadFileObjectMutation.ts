import { gql } from "@apollo/client";

export interface IUploadFileObjectMutationData {
  uploadFileObject: {documentId: string, uploadUrl: string}
}

const uploadFileObjectMutation = gql`
  mutation UploadFileObject($folderId: String!, $type: String!, $name: String!, $filesId: ID!) {
    uploadFileObject(folderId: $folderId, type: $type, name: $name, filesId: $filesId) {
      documentId
      uploadUrl
    }
  }
`;

export default uploadFileObjectMutation;