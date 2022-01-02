import { useQuery } from "@apollo/client";
import { faBell, faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import yn from "yn";
import MenuCollapsed from "../components/menu/MenuCollapsed";
import MenuHeader from "../components/menu/MenuHeader";
import MenuItem from "../components/menu/MenuItem";
import getCurrentUser, { IGetCurrentUserData } from "../graphql/queries/users/getCurrentUser";
import permissions from "../util/permissions";
import PlanetSwitcher from "./PlanetSwitcher";

interface IMessagesSidebarProps {
  toggleHidden: () => void
}

function MessagesSidebar(props: IMessagesSidebarProps): JSX.Element {
  const { data: userData } = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });  
  return (<>
    <MenuCollapsed
      title="Messages"
      icon={faCommentDots}
    >
      {userData?.currentUser && permissions.checkAdminPermission(userData.currentUser) && <MenuHeader>Admin Tools</MenuHeader>}
      {userData?.currentUser && <div>
        <PlanetSwitcher toggleHidden={props.toggleHidden}/>
      </div>}
    </MenuCollapsed>
    <Link className="link-button" to="/messages"><MenuItem icon={faBell}>Notifications</MenuItem></Link>
    {yn(localStorage.getItem("debug.showChat")) && <MenuHeader>Direct Messages</MenuHeader>}
  </>);
}

export default MessagesSidebar;
