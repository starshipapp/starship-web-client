import gql from "graphql-tag";

export interface IUploadMarkdownImageMutationData {
  uploadMarkdownImage: {finalUrl: string, uploadUrl: string}
}

const uploadMarkdownImageMutation = gql`
  mutation UploadMarkdownImage($type: String!, $size: Int!) {
    uploadMarkdownImage(type: $type, size: $size) {
      finalUrl
      uploadUrl
    }
  }
`;

export default uploadMarkdownImageMutation;