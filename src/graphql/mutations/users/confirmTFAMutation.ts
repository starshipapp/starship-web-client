import gql from "graphql-tag";

export interface IConfirmTFAMutation {
  confirmTFA: [number]
}

const confirmTFAMutation = gql`
  mutation ConfirmTFA($token: Int!) {
    confirmTFA(token: $token)
  } 
`;

export default confirmTFAMutation;