import { useMutation } from "@apollo/client";
import { Button, Icon, Intent, NonIdealState } from "@blueprintjs/core";
import clearAllNotificationsMutation, { IClearAllNotificationsMutationData } from "../graphql/mutations/misc/clearAllNotificationsMutation";
import clearNotificationMutation, { IClearNotificationMutationData } from "../graphql/mutations/misc/clearNotificationMutation";
import INotification from "../types/INotification";
import { GlobalToaster } from "../util/GlobalToaster";
import "./css/Notifications.css";

interface INotificationsProps {
  notifications: INotification[]
  refetch: () => void
}

function Notifications(props: INotificationsProps): JSX.Element {
  const [clearNotification] = useMutation<IClearNotificationMutationData>(clearNotificationMutation);
  const [clearAllNotifications] = useMutation<IClearAllNotificationsMutationData>(clearAllNotificationsMutation);
  return (
    <div className="Notifications">
      {props.notifications.map((value) => {
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
                    props.refetch();
                  }).catch((err: Error) => {
                    GlobalToaster.show({message: err.message, intent: Intent.DANGER});
                  });
                }}/>
              </div>
            </div>
          </div>
        );
      })}
      {props.notifications.length < 1 && <NonIdealState
        icon="notifications"
        title="No new notifications."
      />}
      <div className="Notifications-bottom">
        {<Button text="All Notifications" className="Notifications-bottom-all" minimal={true} small={true}/>}
        {<Button text="Clear" className="Notifications-bottom-clear" minimal={true} small={true} onClick={() => {
          clearAllNotifications().then(() => {
            props.refetch();
          }).catch((err: Error) => {
            GlobalToaster.show({message: err.message, intent: Intent.DANGER});
          });
        }}/>}
      </div>
    </div>
  );
}

export default Notifications;