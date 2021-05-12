/* eslint-disable semi */
import { IconName } from "@blueprintjs/icons";

export default interface INotification {
  id: string,
  user?: string,
  createdAt?: Date,
  icon?: IconName,
  text?: string,
  isRead?: boolean
}