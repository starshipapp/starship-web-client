import { useMutation, useQuery } from "@apollo/client";
import { Button, Icon, Intent, MenuItem, NonIdealState, Tag } from "@blueprintjs/core";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import clearAllNotificationsMutation, { IClearAllNotificationsMutationData } from "../graphql/mutations/misc/clearAllNotificationsMutation";
import clearNotificationMutation, { IClearNotificationMutationData } from "../graphql/mutations/misc/clearNotificationMutation";
import markAllReadMutation, { IMarkAllReadMutationData } from "../graphql/mutations/misc/markAllRead";
import getNotifications, { IGetNotificationsData } from "../graphql/queries/misc/getNotifications";
import onNotificationRecieved from "../graphql/subscriptions/misc/onNotificationRecieved";
import INotification from "../types/INotification";
import IUser from "../types/IUser";
import { GlobalToaster } from "../util/GlobalToaster";
import "./css/Notifications.css";

interface INotificationsProps {
  currentUser: IUser
}

let hasSubscribed = false;

function Notifications(props: INotificationsProps): JSX.Element {
  const { subscribeToMore, data: notifications, refetch: refetchNotifs} = useQuery<IGetNotificationsData>(getNotifications, {errorPolicy: 'all'});
  const [clearNotification] = useMutation<IClearNotificationMutationData>(clearNotificationMutation);
  const [clearAllNotifications] = useMutation<IClearAllNotificationsMutationData>(clearAllNotificationsMutation);
  const [markAllRead] = useMutation<IMarkAllReadMutationData>(markAllReadMutation);

  const notifCount = notifications?.notifications ? notifications.notifications.filter((value) => value.isRead === false).length : 0;

  useEffect(() => {
    if(!hasSubscribed && notifications?.notifications) {
      hasSubscribed = true;
      console.log("setting up notification handler");
      subscribeToMore({
        document: onNotificationRecieved,
        updateQuery: (prev, {subscriptionData}) => {
          const data = subscriptionData.data as unknown as {notificationRecieved: INotification};
          if (!data.notificationRecieved) return prev;
          return Object.assign({}, prev, {
            notifications: [data.notificationRecieved, ...prev.notifications]            
          });
        }
      });
    }
  });

  return (
    <MenuItem
      icon="user" 
      className="MainSidebar-notification-item"
      text={props.currentUser.username} 
      labelElement={notifCount > 0 ? <Tag className="MainSidebar-notif-icon" round={true} intent="danger">{notifCount}</Tag> : null} 
      popoverProps={{onClose: () => {
        markAllRead().then(() => {
          void refetchNotifs();
        }).catch((err: Error) => {
          GlobalToaster.show({message: err.message, intent: Intent.DANGER});
        });
      }}}
    > 
      {notifications && notifications.notifications && <div className="Notifications">
        {notifications.notifications.map((value) => {
          const date = new Date(Number(value.createdAt)).toLocaleDateString();

          return (
            <div className={`Notifications-notification ${value.isRead ? "Notifications-unread" : ""}`}>
              <div className="Notifications-notification-text">
                {value.text}
              </div>
              <div className="Notifications-notification-info">
                <div className="Notifications-notification-icon">
                  <Icon icon={value.icon}/>
                </div>
                <div className="Notifications-notification-date">
                  {date}
                </div>
                <div className="Notifications-notification-dismiss">
                  <Button icon="cross" minimal={true} small={true} onClick={() => {
                    clearNotification({variables: {notificationId: value.id}}).then(() => {
                      void refetchNotifs();
                    }).catch((err: Error) => {
                      GlobalToaster.show({message: err.message, intent: Intent.DANGER});
                    });
                  }}/>
                </div>
              </div>
            </div>
          );
        })}
        {notifications.notifications.length < 1 && <NonIdealState
          icon="notifications"
          title="No new notifications."
        />}
        <div className="Notifications-bottom">
          {<Link to="/messages" className="link-button"><Button text="All Notifications" className="Notifications-bottom-all" minimal={true} small={true}/></Link>}
          {<Button text="Clear" className="Notifications-bottom-clear" minimal={true} small={true} onClick={() => {
            clearAllNotifications().then(() => {
              void refetchNotifs();
            }).catch((err: Error) => {
              GlobalToaster.show({message: err.message, intent: Intent.DANGER});
            });
          }}/>}
        </div>
      </div>}
    </MenuItem>
  );
}

export default Notifications;