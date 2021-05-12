import gql from "graphql-tag";

export interface IClearNotificationMutationData {
  clearNotification: boolean
}

const clearNotificationMutation = gql`
  mutation ClearNotification($notificationId: ID!) {
    clearNotification(notificationId: $notificationId)
  }
`;

export default clearNotificationMutation;