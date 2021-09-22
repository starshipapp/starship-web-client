import { useMutation, useQuery } from "@apollo/client";
import { faExclamationTriangle, faGlobe, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Button from "../components/controls/Button";
import Checkbox from "../components/controls/Checkbox";
import Toasts from "../components/display/Toasts";
import Textbox from "../components/input/Textbox";
import MenuHeader from "../components/menu/MenuHeader";
import MenuItem from "../components/menu/MenuItem";
import Popover from "../components/overlays/Popover";
import PopperPlacement from "../components/PopperPlacement";
import insertPlanetMutation, { IInsertPlanetMutationData } from "../graphql/mutations/planets/insertPlanetMutation";
import getCurrentUser, { IGetCurrentUserData } from "../graphql/queries/users/getCurrentUser";

interface IPlanetSwitcherProps {
  toggleHidden: () => void
}

function PlanetSwitcher(props: IPlanetSwitcherProps): JSX.Element {

  const { data, refetch } = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });
  const [planetName, setPlanetName] = useState<string>("");
  const [privatePlanet, setPrivate] = useState<boolean>(false);
  const [showPopout, setPopout] = useState<boolean>(false);
  const [insertPlanet] = useMutation<IInsertPlanetMutationData>(insertPlanetMutation);

  const history = useHistory();

  const createPlanet = function() {
    if(planetName === "") {
      Toasts.danger("Please enter a name.");
      return;
    }

    insertPlanet({variables: {name: planetName, private: privatePlanet}}).then((value) => {
      if(value.data && value.data.insertPlanet) {
        Toasts.success("Planet sucessfully created!");
        void refetch();
        history.push("/planet/" + value.data.insertPlanet.id);
        setPopout(false);
        props.toggleHidden && props.toggleHidden();
      } else {
        Toasts.danger("An unknown data error occured.");
      }
    }).catch((error) => {
      Toasts.danger("An unknown server error occured.");
    });
  };

  return (
    <>
      {data?.currentUser && <>
        {data.currentUser.admin && <Link className="link-button" to="/gadmin/"><MenuItem icon={faExclamationTriangle}>Admin</MenuItem></Link>}
        <MenuHeader>My Planets</MenuHeader>
        {data.currentUser.memberOf?.map((value) => (
          <Link onClick={props.toggleHidden} className="link-button" to={"/planet/" + value.id}><MenuItem icon={faGlobe} key={value.id}>{value.name}</MenuItem></Link>
        ))}
        <Popover
          placement={PopperPlacement.rightEnd}
          open={showPopout}
          onClose={() => setPopout(false)}
          fullWidth
          popoverTarget={
            <MenuItem icon={faPlusCircle} onClick={() => {
              setPopout(!showPopout);
              props.toggleHidden();
            }}>New Planet</MenuItem>
          }
        >
          <div>
            <Textbox className="mb-2" value={planetName} onChange={(e) => setPlanetName(e.target.value)}/>
            <div className="flex">
              <Checkbox className="mb-auto mt-1.5" checked={privatePlanet} onChange={(e) => setPrivate(!privatePlanet)}/>
              <div className="ml-1 mt-1.5 mb-auto">Private</div>
              <Button className="ml-auto" small={true} onClick={createPlanet}>Create</Button>
            </div>
          </div>
        </Popover>
        {data.currentUser.following && data.currentUser.following.length > 0 && <MenuHeader>Following</MenuHeader>}
        {data.currentUser.following?.map((value) => (
          <Link onClick={props.toggleHidden} className="link-button" to={"/planet/" + value.id}><MenuItem icon={faGlobe} key={value.id}>{value.name}</MenuItem></Link>
        ))}
      </>}
    </>
  );
}

export default PlanetSwitcher;