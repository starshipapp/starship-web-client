import { useQuery } from "@apollo/client";
import { faChartBar, faExclamationCircle, faExclamationTriangle, faGlobe, faUsers } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Divider from "../components/display/Divider";
import MenuCollapsed from "../components/menu/MenuCollapsed";
import MenuHeader from "../components/menu/MenuHeader";
import MenuItem from "../components/menu/MenuItem";
import getCurrentUser, { IGetCurrentUserData } from "../graphql/queries/users/getCurrentUser";
import permissions from "../util/permissions";
import PlanetSwitcher from "./PlanetSwitcher";

interface IGAdminSidebarProps {
  toggleHidden: () => void
}

function GAdminSidebar(props: IGAdminSidebarProps): JSX.Element {
  const { data: userData } = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });  

  return (<>
    <MenuCollapsed
      icon={faExclamationTriangle}
      title="Global Admin"
    >
      {userData?.currentUser && permissions.checkAdminPermission(userData.currentUser) && <MenuHeader>Admin Tools</MenuHeader>}
      <PlanetSwitcher toggleHidden={props.toggleHidden}/>
    </MenuCollapsed>
    <Divider/>
    <Link className="link-button" to="/gadmin"><MenuItem icon={faChartBar}>Statistics</MenuItem></Link>
    <Link className="link-button" to="/gadmin/reports"><MenuItem icon={faExclamationCircle}>Reports</MenuItem></Link>
    <Link className="link-button" to="/gadmin/planets"><MenuItem icon={faGlobe}>Planets</MenuItem></Link>
    <Link className="link-button" to="/gadmin/users"><MenuItem icon={faUsers}>Users</MenuItem></Link>
  </>);
}

export default GAdminSidebar;
