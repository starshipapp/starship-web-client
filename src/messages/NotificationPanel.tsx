import { useMutation, useQuery } from "@apollo/client";
import { Button, Icon, Intent, NonIdealState } from "@blueprintjs/core";
import React from "react";
import clearAllNotificationsMutation, { IClearAllNotificationsMutationData } from "../graphql/mutations/misc/clearAllNotificationsMutation";
import clearNotificationMutation, { IClearNotificationMutationData } from "../graphql/mutations/misc/clearNotificationMutation";
import markAllReadMutation, { IMarkAllReadMutationData } from "../graphql/mutations/misc/markAllRead";
import getNotifications, { IGetNotificationsData } from "../graphql/queries/misc/getNotifications";
import IUser from "../types/IUser";
import { GlobalToaster } from "../util/GlobalToaster";
import Markdown from "../util/Markdown";
import "./css/NotificationPanel.css";

interface INotificationPanelProps {
  user: IUser
}

function NotificationPanel(props: INotificationPanelProps): JSX.Element {
  const {data: notifications, refetch: refetchNotifs} = useQuery<IGetNotificationsData>(getNotifications, {errorPolicy: 'all'});
  const [clearNotification] = useMutation<IClearNotificationMutationData>(clearNotificationMutation);
  const [clearAllNotifications] = useMutation<IClearAllNotificationsMutationData>(clearAllNotificationsMutation);

  return (
    <div className="NotificationPanel">
      <div className="NotificationPanel-header">
        <span>Notifications</span>
        <Button text="Clear" className="NotificationPanel-clear" minimal={true} icon="cross" onClick={() => {
          clearAllNotifications().then(() => {
            void refetchNotifs();
          }).catch((err: Error) => {
            GlobalToaster.show({message: err.message, intent: Intent.DANGER});
          });
        }}/>
      </div>
      {notifications && notifications.notifications && <div className="NotificationsPanel-notifications">
        {notifications.notifications.map((value) => {
          const date = new Date(Number(value.createdAt)).toLocaleDateString();

          return (
            <div className={`NotificationsPanel-notification ${value.isRead ? "NotificationsPanel-unread" : ""}`}>
              <div className="NotificationsPanel-notification-icon">
                <Icon icon={value.icon}/>
              </div>
              <div className="NotificationsPanel-notification-text">
                <Markdown>{value.text ?? ""}</Markdown>
              </div>
              <div className="NotificationsPanel-notification-date">
                {date}
              </div>
              <Button
                icon="cross"
                className="NotificationsPanel-notification-dismiss"
                small={true}
                minimal={true}
                onClick={() => {
                  clearNotification({variables: {notificationId: value.id}}).then(() => {
                    void refetchNotifs();
                  }).catch((err: Error) => {
                    GlobalToaster.show({message: err.message, intent: Intent.DANGER});
                  });
                }}
              />
            </div>
          );
        })}
        {notifications.notifications.length < 1 && <NonIdealState
          icon="notifications"
          title="No new notifications."
        />}
      </div>}
    </div>
  );
}

export default NotificationPanel;