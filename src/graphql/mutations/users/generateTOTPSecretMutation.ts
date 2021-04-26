import gql from "graphql-tag";

export interface IGenerateTOTPSecretMutationData {
  generateTOTPSecret: string
}

const generateTOTPSecretMutation = gql`
  mutation GenerateTOTPSecret {
    generateTOTPSecret
  }
`;

export default generateTOTPSecretMutation;