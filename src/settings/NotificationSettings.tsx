import { useMutation } from "@apollo/client";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Button from "../components/controls/Button";
import Option from "../components/controls/Option";
import Toasts from "../components/display/Toasts";
import Intent from "../components/Intent";
import Page from "../components/layout/Page";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import PageSubheader from "../components/layout/PageSubheader";
import List from "../components/list/List";
import ListItem from "../components/list/ListItem";
import setNotificationSettingMutation, { ISetNotificationSettingData } from "../graphql/mutations/users/setNotificationSettingMutation";
import toggleBlockUserMutation, { IToggleBlockUserData } from "../graphql/mutations/users/toggleBlockUserMutation";
import IUser from "../types/IUser";
import MentionSettings from "../util/MentionSettings";

interface INotificationSettingsProps {
  user: IUser
  refetch: () => void
}

function NotificationSettings(props: INotificationSettingsProps): JSX.Element {
  const [blockUser] = useMutation<IToggleBlockUserData>(toggleBlockUserMutation);
  const [setNotificationSetting] = useMutation<ISetNotificationSettingData>(setNotificationSettingMutation);

  const setSetting = function(setting: MentionSettings) {
    setNotificationSetting({variables: {option: setting}}).then(() => {
      props.refetch();
      Toasts.success("Successfully updated notification settings.");
    }).catch((error: Error) => {
      Toasts.danger(error.message);
    });
  };

  return (
    <Page>
      <PageContainer>
        <PageHeader>
          Notifications
        </PageHeader>
        <PageSubheader>Mentions</PageSubheader>
        <Option
          description="Recieve all notifications. (default)"
          checked={props.user.notificationSetting ? props.user.notificationSetting === MentionSettings.allMentions : true}
          onClick={() => setSetting(MentionSettings.allMentions)}
        >
          Everything
        </Option>
        <Option
          description="Recieve notifications from followed planets, planets you're a member of and direct messages."
          checked={props.user.notificationSetting === MentionSettings.following}
          onClick={() => setSetting(MentionSettings.following)}
        >
          Followed
        </Option>
        <Option 
          description="Recieve notifications from planets you're a member of and direct messages."
          checked={props.user.notificationSetting === MentionSettings.membersOnly}
          onClick={() => setSetting(MentionSettings.membersOnly)}
        >
          My Planets
        </Option>
        <Option
          description="Recieve only direct message notifications."
          checked={props.user.notificationSetting === MentionSettings.messagesOnly}
          onClick={() => setSetting(MentionSettings.messagesOnly)}
        >
          Direct Messages
        </Option>
        <Option
          description="Do not receive any notifications (except for system messages)."
          checked={props.user.notificationSetting === MentionSettings.none}
          onClick={() => setSetting(MentionSettings.none)}
        >
          Nothing
        </Option>
        <PageSubheader>Blocked Users</PageSubheader>
        <p>Blocked Users can't message or mention you, and their forum posts and chat messages will be hidden.</p>
        <List
          name={`${String(props.user.blockedUsers?.length)} blocked user${((props.user.blockedUsers?.length ?? 0) !== 1) ? "s" : ""}`}
        >
          {props.user.blockedUsers?.map((value) => <ListItem
            actions={<Button
              icon={faTimes}
              intent={Intent.DANGER}
              minimal
              small
              onClick={() => {
                blockUser({variables: {userId: value.id}}).then(() => {
                  Toasts.success(`Unblocked ${value.username ?? "unknown user"}.`);
                }).catch((error: Error) => {
                  Toasts.danger(error.message);
                });
              }}
            />}
          >
            {value.username}
          </ListItem>)}
        </List>
      </PageContainer>
    </Page>
  );
}

export default NotificationSettings;
