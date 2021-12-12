import { useQuery } from "@apollo/client";
import { NonIdealState } from "@blueprintjs/core";
import React from "react";
import { Route } from "react-router";
import { Routes } from "react-router-dom";
import getCurrentUser, { IGetCurrentUserData } from "../graphql/queries/users/getCurrentUser";
import NotificationPanel from "./NotificationPanel";

function Messages(): JSX.Element {
  const {data: userData} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });

  if(!userData?.currentUser) {
    return (
      <NonIdealState
        icon="error"
        title="You're not logged in."
      />
    );
  }

  return (<>
    <Routes>
      <Route path="/" element={<NotificationPanel user={userData.currentUser}/>}/>
    </Routes>
  </>);
}

export default Messages;
