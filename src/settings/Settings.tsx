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
import NotificationSettings from "./NotificationSettings";
import About from "./About";

function Settings(): JSX.Element {
  const {data: userData, refetch} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });
  const match = useRouteMatch();

  if(userData?.currentUser) {
    return (
      <Switch>
        <Route path={`${match.path}/security`}>
          <SecuritySettings user={userData.currentUser} refetch={() => refetch()}/>
        </Route>
        <Route path={`${match.path}/emojis`}>
          <EmojiSettings user={userData.currentUser} refetch={() => refetch()}/>
        </Route>
        <Route path={`${match.path}/notifications`}>
          <NotificationSettings user={userData.currentUser} refetch={() => refetch()}/>
        </Route>
        <Route path={`${match.path}/about`}>
          <About/>
        </Route>
        <Route path={`${match.path}`}>
          <ProfileSettings user={userData.currentUser} refetch={() => refetch()}/>
        </Route>
      </Switch>
    );
  } else {
    return (
      <NonIdealState
        icon="error"
        title="You're not logged in."
      />
    );
  }
}

export default Settings;