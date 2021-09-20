import { useMutation, useQuery } from "@apollo/client";
import { Intent as bpIntent, NonIdealState } from "@blueprintjs/core";
import { faTimes, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
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
import { GlobalToaster } from "../util/GlobalToaster";
import Markdown from "../util/Markdown";
import "./css/Notifications.css";

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
  const history = useHistory();

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
          }
        }, 100);
      }}
    >
      <Popover 
        open={showPopover}
        onClose={() => setShowPopover(false)}
        fullWidth={true}
        placement={PopperPlacement.right}
        popoverTarget={
          <Link to="/messages" className="link-button">
            <MenuItem 
              icon={faUser}
              rightElement={notifCount ?
                <span className="rounded-full bg-red-400 text-black min-w-4 w-full dark:text-white dark:bg-red-600 px-2 py-0.5">
                  {notifCount}
                </span>
              : undefined}
            >
              {props.currentUser.username}
            </MenuItem>
          </Link>
        }
      >
        {notifications && notifications.notifications && <div className="">
          {notifications.notifications.map((value) => {
            const date = new Date(Number(value.createdAt)).toLocaleDateString();

            return (
              <div className="w-64 border-b border-gray-400 pb-1 mb-1.5">
                <div className="">
                  <Markdown>{value.text ?? ""}</Markdown>
                </div>
                <div className="flex -mt-1 text-gray-600 ">
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
                        GlobalToaster.show({message: err.message, intent: bpIntent.DANGER});
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
          <div className="-mb-1 -mt-0.5 flex">
            {<Link to="/messages" className="link-button"><Button className="" minimal={true} small={true}>All Notifications</Button></Link>}
            {<Button className="ml-auto" minimal={true} small={true} onClick={() => {
              clearAllNotifications().then(() => {
                void refetchNotifs();
              }).catch((err: Error) => {
                GlobalToaster.show({message: err.message, intent: bpIntent.DANGER});
              });
            }}>Clear</Button>}
          </div>
        </div>}
      </Popover>
      
    </div>
  );

  /* return (
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
      onClick={() => history.push("/messages")}
    > 
      {notifications && notifications.notifications && <div className="Notifications">
        {notifications.notifications.map((value) => {
          const date = new Date(Number(value.createdAt)).toLocaleDateString();

          return (
            <div className={`Notifications-notification ${value.isRead ? "Notifications-unread" : ""}`}>
              <div className="Notifications-notification-text">
                <Markdown>{value.text ?? ""}</Markdown>
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
  );*/
}

export default Notifications;