/* eslint-disable semi */

export default interface INotification {
  id: string,
  user?: string,
  createdAt?: Date,
  icon?: string,
  text?: string,
  isRead?: boolean
}