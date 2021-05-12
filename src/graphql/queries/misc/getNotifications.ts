import { gql } from '@apollo/client';
import INotification from '../../../types/INotification';

export interface IGetNotificationsData {
  notifications: INotification[]
}

const getNotifications = gql `
  query getNotifications {
    notifications {
      id
      createdAt
      icon
      text
      isRead
    }
  }
`;

export default getNotifications;