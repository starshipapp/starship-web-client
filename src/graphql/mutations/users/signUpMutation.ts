import { gql } from "@apollo/client";
import IUser from "../../../types/IUser";

export interface ISignUpMutationData {
  insertUser: IUser
}

const signUpMutation = gql`
  mutation SignUp($username: String!, $password: String!, $email: String!) {
    insertUser(username: $username, password: $password, email: $email, recaptcha: "") {
      id,
      username
    }
  }
`;

export default signUpMutation;