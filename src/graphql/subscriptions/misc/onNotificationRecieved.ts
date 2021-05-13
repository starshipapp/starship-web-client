import gql from "graphql-tag";

const onNotificationRecieved = gql`
  subscription OnNotificationRecieved {
    notificationRecieved {
      id
      createdAt
      text
      icon
      isRead
    }
  }
`;

export default onNotificationRecieved;