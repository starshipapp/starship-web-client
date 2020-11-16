import { gql } from "@apollo/client";

export interface ISignInMutationData {
  loginUser: {
    token: string
  }
}

const signInMutation = gql`
  mutation SignIn($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      token
    }
  }
`;

export default signInMutation;