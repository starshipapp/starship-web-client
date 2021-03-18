import gql from "graphql-tag";

export interface IResetPasswordMutationData {
  resetPassword: boolean
}

const resetPasswordMutation = gql`
  mutation ResetPassword($userId: ID!, $token: String!, $password: String!) {
    resetPassword(userId: $userId, token: $token, password: $password)
  }
`;

export default resetPasswordMutation;