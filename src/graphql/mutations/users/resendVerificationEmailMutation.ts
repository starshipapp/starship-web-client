import gql from "graphql-tag";

export interface IResendVerificationEmailMutationData {
  resendVerificationEmail: boolean
}

const resendVerificationEmailMutation = gql`
  mutation ResendVerificationEmail($username: String!) {
    resendVerificationEmail(username: $username)
  }
`;

export default resendVerificationEmailMutation;