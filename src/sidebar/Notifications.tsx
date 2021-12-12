import { useMutation, useQuery } from "@apollo/client";
import { faBell, faTimes, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/controls/Button";
import MenuItem from "../components/menu/MenuItem";
import Popover from "../components/overlays/Popover";
import PopperPlacement from "../components/PopperPlacement";
import clearAllNotificationsMutation, { IClearAllNotificationsMutationData } from "../graphql/mutations/misc/clearAllNotificationsMutation";
import clearNotificationMutation, { IClearNotificationMutationData } from "../graphql/mutations/misc/clearNotificationMutation";
import markAllReadMutation, { IMarkAllReadMutationData } from "../graphql/mutations/misc/markAllRead";
import getNotifications, { IGetNotificationsData } from "../graphql/queries/misc/getNotifications";
import onNotificationRecieved from "../graphql/subscriptions/misc/onNotificationRecieved";
import IconNameToProp from "../util/IconNameToProp";
import INotification from "../types/INotification";
import IUser from "../types/IUser";
import Markdown from "../util/Markdown";
import Tag from "../components/display/Tag";
import NonIdealState from "../components/display/NonIdealState";
import Intent from "../components/Intent";
import Toasts from "../components/display/Toasts";

interface INotificationsProps {
  currentUser: IUser
}

let hasSubscribed = false;
let isMouseIn = false;

function Notifications(props: INotificationsProps): JSX.Element {
  const [showPopover, setShowPopover] = useState(false);
  const { subscribeToMore, data: notifications, refetch: refetchNotifs} = useQuery<IGetNotificationsData>(getNotifications, {errorPolicy: 'all'});
  const [clearNotification] = useMutation<IClearNotificationMutationData>(clearNotificationMutation);
  const [clearAllNotifications] = useMutation<IClearAllNotificationsMutationData>(clearAllNotificationsMutation);
  const [markAllRead] = useMutation<IMarkAllReadMutationData>(markAllReadMutation);

  const notifCount = notifications?.notifications ? notifications.notifications.filter((value) => value.isRead === false).length : 0;

  useEffect(() => {
    if(!hasSubscribed && notifications?.notifications) {
      hasSubscribed = true;
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
    <div 
      onMouseEnter={() => {
        isMouseIn = true;
        setShowPopover(true);
      }}
      onMouseLeave={() => {
        isMouseIn = false;
        setTimeout(() => {
          if(!isMouseIn) {
            setShowPopover(false);
            markAllRead().then(() => {
              void refetchNotifs();
            }).catch((err: Error) => {
              Toasts.danger(err.message);
            });
          }
        }, 100);
      }}
    >
      <Popover 
        open={showPopover}
        onClose={() => setShowPopover(false)}
        fullWidth={true}
        placement={PopperPlacement.rightEnd}
        popoverTarget={
          <Link to="/messages" className="link-button">
            <MenuItem 
              icon={faUser}
              rightElement={notifCount ?
                <Tag intent={Intent.DANGER}>{notifCount}</Tag>
              : undefined}
            >
              {props.currentUser.username}
            </MenuItem>
          </Link>
        }
      >
        {notifications && notifications.notifications && <div className="px-1 py-0.5">
          {notifications.notifications.map((value) => {
            const date = new Date(Number(value.createdAt)).toLocaleDateString();

            return (
              <div className="w-64 border-b border-gray-400 dark:border-gray-500 pb-1 mb-1.5">
                <div className="">
                  <Markdown>{value.text ?? ""}</Markdown>
                </div>
                <div className="flex -mt-1 text-gray-600 dark:text-gray-400 ">
                  <div>
                    <FontAwesomeIcon icon={IconNameToProp(value.icon ?? "warning-sign")}/>
                  </div>
                  <div className="ml-1">
                    {date}
                  </div>
                  <div className="ml-auto -mt-1 -mr-1">
                    <Button icon={faTimes} minimal={true} small={true} onClick={() => {
                      clearNotification({variables: {notificationId: value.id}}).then(() => {
                        void refetchNotifs();
                      }).catch((err: Error) => {
                        Toasts.danger(err.message);
                      });
                    }}/>
                  </div>
                </div>
              </div>
            );
          })}
          {notifications.notifications.length < 1 && <NonIdealState
            icon={faBell}
            title="No new notifications."
          />}
          <div className="-mb-1 -mt-0.5 flex">
            {<Link to="/messages" className="link-button"><Button className="" minimal={true} small={true}>All Notifications</Button></Link>}
            {<Button className="ml-auto" minimal={true} small={true} onClick={() => {
              clearAllNotifications().then(() => {
                void refetchNotifs();
              }).catch((err: Error) => {
                Toasts.danger(err.message);
              });
            }}>Clear</Button>}
          </div>
        </div>}
      </Popover>
      
    </div>
  );
}

export default Notifications;
