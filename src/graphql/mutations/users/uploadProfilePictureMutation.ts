import gql from "graphql-tag";

export interface IUploadProfilePictureMutationData {
  uploadProfilePicture: string
}

const uploadProfilePictureMutation = gql`
  mutation UploadProfilePicture($type: String!, $size: Int!) {
    uploadProfilePicture(type: $type, size: $size)
  }
`;

export default uploadProfilePictureMutation;