import { gql } from "@apollo/client";

const signUpMutation = gql`
  mutation SignUp($username: String!, $password: String!, $email: String!) {
    insertUser(username: $username, password: $password, email: $email, recaptcha: "") {
      id,
      user
    }
  }
`;

export default signUpMutation;