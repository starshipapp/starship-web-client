import gql from "graphql-tag";

export interface IUploadProfileBannerMutationData {
  uploadProfileBanner: string
}

const uploadProfileBannerMutation = gql`
  mutation UploadProfileBanner($type: String!, $size: Int!) {
    uploadProfileBanner(type: $type, size: $size)
  }
`;

export default uploadProfileBannerMutation;