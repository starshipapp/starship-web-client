import { useQuery } from "@apollo/client";
import getCurrentUser, { IGetCurrentUserData } from "../graphql/queries/users/getCurrentUser";
import { Route } from "react-router";
import ProfileSettings from "./ProfileSettings";
import SecuritySettings from "./SecuritySettings";
import EmojiSettings from "./EmojiSettings";
import NotificationSettings from "./NotificationSettings";
import About from "./About";
import NonIdealState from "../components/display/NonIdealState";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import AppearanceSettings from "./AppearanceSettings";
import { Routes } from "react-router-dom";

function Settings(): JSX.Element {
  const {data: userData, refetch} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });

  if(userData?.currentUser) {
    return (
      <Routes>
        <Route path="security" element={<SecuritySettings user={userData.currentUser} refetch={() => refetch()}/>}/>
        <Route path="profile" element={<ProfileSettings user={userData.currentUser} refetch={() => refetch()}/>}/>
        <Route path="emojis" element={<EmojiSettings user={userData.currentUser} refetch={() => refetch()}/>}/>
        <Route path="notifications" element={<NotificationSettings user={userData.currentUser} refetch={() => refetch()}/>}/>
        <Route path="appearance" element={<AppearanceSettings/>}/>
        <Route path="about" element={<About/>}/>
        <Route path="/" element={<ProfileSettings user={userData.currentUser} refetch={() => refetch()}/>}/>
      </Routes>
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
