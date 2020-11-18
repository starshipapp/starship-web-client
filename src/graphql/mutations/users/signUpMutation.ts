import { gql } from "@apollo/client";
import IUser from "../../../types/IUser";

export interface ISignUpMutationData {
  insertUser: IUser
}

const signUpMutation = gql`
  mutation SignUp($username: String!, $password: String!, $email: String!, $recaptcha: String!) {
    insertUser(username: $username, password: $password, email: $email, recaptcha: $recaptcha) {
      id,
      username
    }
  }
`;

export default signUpMutation;