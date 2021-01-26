import { gql } from "@apollo/client";

export interface IGetObjectPreview {
  getObjectPreview: string
}

const getObjectPreview = gql`
  query GetObjectPreview($fileId: ID!) {
    getObjectPreview(fileId: $fileId)
  }
`;

export default getObjectPreview;