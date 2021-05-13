import gql from "graphql-tag";

const onNotificationRecieved = gql`
  subscription OnNotificaitonRecieved {
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