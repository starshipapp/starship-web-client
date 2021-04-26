import gql from "graphql-tag";

export interface IFinalizeAuthorizationMutationData {
  finalizeAuthorization: {
    token: string
    expectingTFA: boolean
  }
}

const finalizeAuthorizationMutation = gql`
  mutation FinalizeAuthorization($loginToken: String!, $totpToken: Int!) {
    finalizeAuthorization(loginToken: $loginToken, totpToken: $totpToken) {
      token
      expectingTFA
    }
  }
`;

export default finalizeAuthorizationMutation;