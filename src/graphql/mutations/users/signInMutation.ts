import { gql } from "@apollo/client";

const signInMutation = gql`
  mutation SignIn($username: String!, $password: String!) {
    loginUser(username: $username, password: $string) {
      token
    }
  }
`;

export default signInMutation;