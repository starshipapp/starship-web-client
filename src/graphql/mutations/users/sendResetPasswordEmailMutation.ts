import gql from "graphql-tag";

export interface ISendResetPasswordEmailMutationData {
  sendResetPasswordEmail: boolean
}

const sendResetPasswordEmailMutation = gql`
  mutation SendResetPasswordEmail($username: String!) {
    sendResetPasswordEmail(username: $username)
  }
`;

export default sendResetPasswordEmailMutation;