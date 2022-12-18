import { useQuery } from "@apollo/client";
import { faBell, faCog, faInfoCircle, faLock, faPalette, faSmile, faUser } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Link } from "react-router-dom";
import Divider from "../components/display/Divider";
import MenuCollapsed from "../components/menu/MenuCollapsed";
import MenuHeader from "../components/menu/MenuHeader";
import MenuItem from "../components/menu/MenuItem";
import getCurrentUser, { IGetCurrentUserData } from "../graphql/queries/users/getCurrentUser";
import permissions from "../util/permissions";
import PlanetSwitcher from "./PlanetSwitcher";

interface ISettingsSidebarProps {
  toggleHidden: () => void
}

function SettingsSidebar(props: ISettingsSidebarProps): JSX.Element {
  const { data: userData } = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });  
  const [open, setOpen] = useState(false);

  return (<>
    <MenuCollapsed
      icon={faCog}
      title="Settings"
      open={open}
      onOpen={() => setOpen(!open)}
    >
      {userData?.currentUser && permissions.checkAdminPermission(userData.currentUser) && <MenuHeader>Admin Tools</MenuHeader>}
      <PlanetSwitcher toggleHidden={() => {
        props.toggleHidden();
        setOpen(false);
      }}/>
    </MenuCollapsed>
    <Divider/>
    <Link className="link-button" to="/settings"><MenuItem icon={faUser}>Profile</MenuItem></Link>
    <Link className="link-button" to="/settings/security"><MenuItem icon={faLock}>Security</MenuItem></Link>
    <Link className="link-button" to="/settings/emojis"><MenuItem icon={faSmile}>Emojis</MenuItem></Link>
    <Link className="link-button" to="/settings/notifications"><MenuItem icon={faBell}>Notifications</MenuItem></Link>
    <Link className="link-button" to="/settings/appearance"><MenuItem icon={faPalette}>Appearance</MenuItem></Link>
    <Divider/>
    <Link className="link-button" to="/settings/about"><MenuItem icon={faInfoCircle}>About Starship</MenuItem></Link>
  </>);
}

export default SettingsSidebar;
