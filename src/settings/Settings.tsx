import { useMutation, useQuery } from "@apollo/client";
import { Button, Icon, Intent, NonIdealState } from "@blueprintjs/core";
import axios from "axios";
import React, { useRef, useState } from "react";
import disableTFAMutation, { IDisableTFAMutation } from "../graphql/mutations/users/disableTFAMutation";
import uploadProfilePictureMutation, { IUploadProfilePictureMutationData } from "../graphql/mutations/users/uploadProfilePictureMutation";
import getCurrentUser, { IGetCurrentUserData } from "../graphql/queries/users/getCurrentUser";
import fixPFP from "../util/fixPFP";
import { GlobalToaster } from "../util/GlobalToaster";
import TFAPrompt from "../util/TFAPrompt";
import "./css/Settings.css";
import TFAWizard from "./TFAWizard";
import yn from 'yn';
import { Route, Switch, useRouteMatch } from "react-router";
import ProfileSettings from "./ProfileSettings";
import SecuritySettings from "./SecuritySettings";
import EmojiSettings from "./EmojiSettings";

function Settings(): JSX.Element {
  const fileInput = useRef<HTMLInputElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const {data: userData, refetch} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });
  const [uploadProfilePicture] = useMutation<IUploadProfilePictureMutationData>(uploadProfilePictureMutation);
  const [disableTFA] = useMutation<IDisableTFAMutation>(disableTFAMutation);
  const [isTFAOpen, setTFAOpen] = useState<boolean>(false);
  const [isTFAPromptOpen, setTFAPromptOpen] = useState<boolean>(false);
  const useRedesign = yn(localStorage.getItem("superSecretSetting.useRedesign"));
  const match = useRouteMatch();

  if(useRedesign && userData?.currentUser) {
    return (
      <Switch>
        <Route path={`${match.path}/security`}>
          <SecuritySettings user={userData.currentUser} refetch={() => refetch()}/>
        </Route>
        <Route path={`${match.path}/emojis`}>
          <EmojiSettings user={userData.currentUser} refetch={() => refetch()}/>
        </Route>
        <Route path={`${match.path}`}>
          <ProfileSettings user={userData.currentUser} refetch={() => refetch()}/>
        </Route>
      </Switch>
    );
  }

  if(!userData?.currentUser) {
    return (
      <NonIdealState
        icon="error"
        title="You're not logged in."
      />
    );
  }

  return (
    <div className="Settings bp3-dark">
      <input
        type="file"
        ref={fileInput}
        id="upload-button"
        style={{ display: "none" }}
        onChange={(e) => {
          if(!e.target.files) {
            return false;
          }
          const file = e.target.files[0];
          uploadProfilePicture({variables: {type: file.type, size: file.size}}).then((data) => {
            const options = { headers: { "Content-Type": file.type, "x-amz-acl": "public-read" }};
            if(!data.data?.uploadProfilePicture) {
              GlobalToaster.show({message: "The server did not return an address to upload.", intent: Intent.DANGER});
              return;
            }
            axios.put(data.data?.uploadProfilePicture, file, options).then(() => {
              refetch().then((data) => {
                if(!image.current) {
                  return;
                }
                image.current.src = (data.data.currentUser.profilePicture ?? "") + "?t=" + String(Number(Date.now()));
              }).catch(() => {
                GlobalToaster.show({message: "Unable to fetch new user data.", intent: Intent.DANGER});
              });
            }).catch(function (error) {
              // handle error
            });
          }).catch((error: Error) => {
            GlobalToaster.show({message: error.message, intent: Intent.DANGER});
          });
        }}
      />
      <div className="Settings-header">
        <div className="Settings-header-text">
          Settings
        </div>
      </div>
      <div className="Settings-container">
        <h1>Profile Picture</h1>
        <div className="Settings-profilepic" onClick={() => fileInput.current?.click()}>
          {/* eslint-disable-next-line jsx-a11y/img-redundant-alt*/}
          {userData?.currentUser && userData?.currentUser.profilePicture && <img alt="Change profile picture" src={fixPFP(userData.currentUser.profilePicture) + "?t=" + String(Number(Date.now()))} ref={image}/>}
          <Icon icon="upload" className="Settings-uploadpfp"/>
        </div>
        <h1>Security</h1>
        <div className="Settings-tfa">
          <p>Two Factor Authentication <b>is{userData?.currentUser && !userData.currentUser.tfaEnabled && " not"}</b> enabled</p>
          {userData?.currentUser && !userData.currentUser.tfaEnabled && <Button onClick={() => setTFAOpen(true)}>Enable 2FA</Button>}
          {userData?.currentUser && userData.currentUser.tfaEnabled && <Button onClick={() => setTFAPromptOpen(true)}>Disable 2FA</Button>}
          <TFAPrompt 
            onSubmit={(key) => {
              disableTFA({variables: {token: key}}).then(() => {
                GlobalToaster.show({message: "Disabled two factor authentication.", intent: Intent.SUCCESS});
                void refetch();
                setTFAPromptOpen(false);
              }).catch((err: Error) => {
                GlobalToaster.show({message: err.message, intent: Intent.DANGER});
              });
            }}
            onClose={() => {setTFAPromptOpen(false);}}
            isOpen={isTFAPromptOpen}
          />
          <TFAWizard isOpen={isTFAOpen} onClose={() => setTFAOpen(false)} onComplete={() => void refetch()}/>
        </div>
      </div>
    </div>
  );
}

export default Settings;