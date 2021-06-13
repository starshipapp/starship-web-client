import { useMutation } from "@apollo/client";
import { Button, Intent, Radio, RadioGroup } from "@blueprintjs/core";
import React, { useState } from "react";
import setNotificationSettingMutation, { ISetNotificationSettingData } from "../graphql/mutations/users/setNotificationSettingMutation";
import toggleBlockUserMutation, { IToggleBlockUserData } from "../graphql/mutations/users/toggleBlockUserMutation";
import IUser from "../types/IUser";
import { GlobalToaster } from "../util/GlobalToaster";
import MentionSettings from "../util/MentionSettings";
import "./css/NotificationSettings.css";

interface INotificationSettingsProps {
  user: IUser
  refetch: () => void
}

function NotificationSettings(props: INotificationSettingsProps): JSX.Element {
  const [blockUser] = useMutation<IToggleBlockUserData>(toggleBlockUserMutation);
  const [setNotificationSetting] = useMutation<ISetNotificationSettingData>(setNotificationSettingMutation);

  return (
    <div className="Settings bp3-dark">
      <div className="Settings-container">
        <div className="Settings-page-header">
          Notifications
        </div>
        <h1 className="Settings-subheader">Mentions</h1>
        <RadioGroup
          label="Recieve mention notifications from:"
          onChange={(e) => {
            setNotificationSetting({variables: {option: Number(e.currentTarget.value)}}).then(() => {
              props.refetch();
              GlobalToaster.show({message: "Successfully updated notification settings.", intent: Intent.SUCCESS});
            }).catch((error: Error) => {
              GlobalToaster.show({message: error.message, intent: Intent.DANGER});
            });
          }}
          selectedValue={props.user.notificationSetting ?? 0}
        >
          <Radio value={MentionSettings.allMentions} label="Everything"/>
          <Radio value={MentionSettings.following} label="Followed & My Planets"/>
          <Radio value={MentionSettings.membersOnly} label="My Planets only"/>
          <Radio value={MentionSettings.messagesOnly} label="Direct Messages only"/>
          <Radio value={MentionSettings.none} label="Nothing"/>
        </RadioGroup>
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