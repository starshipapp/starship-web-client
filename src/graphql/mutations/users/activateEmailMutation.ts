import gql from "graphql-tag";

export interface IActivateEmailMutationData {
  activateEmail: boolean
}

const activateEmailMutation = gql`
  mutation ActivateEmail($userId: ID!, $token: String!) {
    activateEmail(userId: $userId, token: $token)
  }
`;

export default activateEmailMutation;