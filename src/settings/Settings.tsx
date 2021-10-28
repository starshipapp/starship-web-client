import { useQuery } from "@apollo/client";
import getCurrentUser, { IGetCurrentUserData } from "../graphql/queries/users/getCurrentUser";
import { Route, Switch, useRouteMatch } from "react-router";
import ProfileSettings from "./ProfileSettings";
import SecuritySettings from "./SecuritySettings";
import EmojiSettings from "./EmojiSettings";
import NotificationSettings from "./NotificationSettings";
import About from "./About";
import NonIdealState from "../components/display/NonIdealState";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

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
        className="dark:bg-gray-900"
        icon={faExclamationTriangle}
        title="You're not logged in."
      />
    );
  }
}

export default Settings;
