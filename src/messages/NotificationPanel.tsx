import { useMutation, useQuery } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clearAllNotificationsMutation, { IClearAllNotificationsMutationData } from "../graphql/mutations/misc/clearAllNotificationsMutation";
import clearNotificationMutation, { IClearNotificationMutationData } from "../graphql/mutations/misc/clearNotificationMutation";
import getNotifications, { IGetNotificationsData } from "../graphql/queries/misc/getNotifications";
import IconNameToProp from "../util/IconNameToProp";
import IUser from "../types/IUser";
import Markdown from "../util/Markdown";
import Page from "../components/layout/Page";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import List from "../components/list/List";
import Button from "../components/controls/Button";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Toasts from "../components/display/Toasts";
import ListItem from "../components/list/ListItem";

interface INotificationPanelProps {
  user: IUser
}

function NotificationPanel(props: INotificationPanelProps): JSX.Element {
  const {data: notifications, refetch: refetchNotifs} = useQuery<IGetNotificationsData>(getNotifications, {errorPolicy: 'all'});
  const [clearNotification] = useMutation<IClearNotificationMutationData>(clearNotificationMutation);
  const [clearAllNotifications] = useMutation<IClearAllNotificationsMutationData>(clearAllNotificationsMutation);

  return (
    <Page>
      <PageContainer>
        <PageHeader>Notifications</PageHeader>
        {notifications?.notifications &&<List
          name={`${String(notifications.notifications.length)} notificatio` + (notifications.notifications.length === 1 ? "n" : "ns")}
          actions={<Button
            icon={faTimes}
            minimal
            small
            onClick={() => {
              clearAllNotifications().then(() => {
                void refetchNotifs();
              }).catch((err: Error) => {
                Toasts.danger(err.message);
              });
            }}
          >
            Clear All
          </Button>}
        >
        {notifications.notifications.map((value) => {
          return (
            <ListItem
              icon={<FontAwesomeIcon icon={IconNameToProp(value.icon ?? "warning-sign")}/>}
              actions={<Button
                icon={faTimes}
                minimal
                small
                onClick={() => {
                  clearNotification({variables: {notificationId: value.id}}).then(() => {
                    void refetchNotifs();
                  }).catch((err: Error) => {
                    Toasts.danger(err.message);
                  });
                }}
              />}
            >
              <Markdown className="mt-2">{value.text ?? ""}</Markdown>
            </ListItem>
          );
        })}
        </List>}
      </PageContainer>
    </Page>
  );
}

export default NotificationPanel;
