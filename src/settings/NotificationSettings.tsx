import { useMutation } from "@apollo/client";
import { Button, Intent } from "@blueprintjs/core";
import toggleBlockUserMutation, { IToggleBlockUserData } from "../graphql/mutations/users/toggleBlockUserMutation";
import IUser from "../types/IUser";
import { GlobalToaster } from "../util/GlobalToaster";
import "./css/NotificationSettings.css";

interface INotificationSettingsProps {
  user: IUser
  refetch: () => void
}

function NotificationSettings(props: INotificationSettingsProps): JSX.Element {
  const [blockUser] = useMutation<IToggleBlockUserData>(toggleBlockUserMutation);

  return (
    <div className="Settings bp3-dark">
      <div className="Settings-container">
        <div className="Settings-page-header">
          Notifications
        </div>
        <h1 className="Settings-subheader">Blocked Users</h1>
        <p>Blocked Users can't message or mention you, and their forum posts and chat messages will be hidden.</p>
        <div className="Settings-table-topbar">
          <div className="Settings-table-number">
            {props.user.blockedUsers?.length} blocked user{(props.user.blockedUsers?.length ?? 0) !== 1 && "s"}
          </div>
        </div>
        <div className="Settings-table">
          {props.user.blockedUsers?.map((value) => (<div className="Settings-row">
            <img className="Settings-row-icon NotificationSettings-pfp" src={value.profilePicture} alt={value.username}/>
            <div className="Settings-row-text">
              {value.username}
            </div>
            <Button
              className="Settings-row-button"
              icon="cross"
              intent={Intent.DANGER}
              minimal={true}
              small={true}
              onClick={() => {
                blockUser({variables: {userId: value.id}}).then(() => {
                  GlobalToaster.show({message: `$Unblocked ${value.username ?? "unknown user"}.`, intent: Intent.SUCCESS});
                }).catch((error: Error) => {
                  GlobalToaster.show({message: error.message, intent: Intent.DANGER});
                });
              }}
            />
          </div>))}
        </div>
      </div>
    </div>
  );
}

export default NotificationSettings;