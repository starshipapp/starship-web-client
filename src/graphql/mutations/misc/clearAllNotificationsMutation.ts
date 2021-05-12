import gql from "graphql-tag";

export interface IClearAllNotificationsMutationData {
  clearAllNotifications: boolean
}

const clearAllNotificationsMutation = gql`
  mutation ClearAllNotifications {
    clearAllNotifications
  }
`;

export default clearAllNotificationsMutation;