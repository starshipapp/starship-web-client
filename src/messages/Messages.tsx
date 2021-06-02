import { useQuery } from "@apollo/client";
import { NonIdealState } from "@blueprintjs/core";
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import getCurrentUser, { IGetCurrentUserData } from "../graphql/queries/users/getCurrentUser";
import NotificationPanel from "./NotificationPanel";

function Messages(): JSX.Element {
  const {data: userData} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });
  const match = useRouteMatch();

  if(!userData?.currentUser) {
    return (
      <NonIdealState
        icon="error"
        title="You're not logged in."
      />
    );
  }

  return (<>
    <Switch>
      <Route path={`${match.path}`}>
        <NotificationPanel user={userData.currentUser}/>
      </Route>
    </Switch>
  </>);
}

export default Messages;