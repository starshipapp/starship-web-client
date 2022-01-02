import { useQuery } from "@apollo/client";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { Route } from "react-router";
import { Routes } from "react-router-dom";
import NonIdealState from "../components/display/NonIdealState";
import getCurrentUser, { IGetCurrentUserData } from "../graphql/queries/users/getCurrentUser";
import NotificationPanel from "./NotificationPanel";

function Messages(): JSX.Element {
  const {data: userData} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });

  if(!userData?.currentUser) {
    return (
      <NonIdealState
        icon={faExclamationTriangle}
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
