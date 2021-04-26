import { gql } from "@apollo/client";

export interface ISignInMutationData {
  loginUser: {
    token: string
    expectingTFA: boolean
  }
}

const signInMutation = gql`
  mutation SignIn($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      token
      expectingTFA
    }
  }
`;

export default signInMutation;