import { useMutation, useQuery } from "@apollo/client";
import { Button, Checkbox, Classes, Intent, MenuDivider, MenuItem, Popover, Position } from "@blueprintjs/core";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import insertPlanetMutation, { IInsertPlanetMutationData } from "../graphql/mutations/planets/insertPlanetMutation";
import getCurrentUser, { IGetCurrentUserData } from "../graphql/queries/users/getCurrentUser";
import { GlobalToaster } from "../util/GlobalToaster";
import isMobile from "../util/isMobile";

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
      GlobalToaster.show({message: "Please enter a name.", intent: Intent.DANGER});
      return;
    }

    insertPlanet({variables: {name: planetName, private: privatePlanet}}).then((value) => {
      if(value.data && value.data.insertPlanet) {
        GlobalToaster.show({message: "Planet sucessfully created!", intent: Intent.SUCCESS});
        void refetch();
        history.push("/planet/" + value.data.insertPlanet.id);
        setPopout(false);
        props.toggleHidden && props.toggleHidden();
      } else {
        GlobalToaster.show({message: "An unknown data error occured.", intent: Intent.DANGER});
      }
    }).catch((error) => {
      GlobalToaster.show({message: "An unknown server error occured.", intent: Intent.DANGER});
    });
  };

  return (
    <>
      {data?.currentUser && <>
        {data.currentUser.admin && <Link className="link-button" to="/gadmin/"><MenuItem icon="warning-sign" text="Admin"/></Link>}
        <MenuDivider title="MY PLANETS"/>
        {data.currentUser.memberOf?.map((value) => (
          <Link onClick={props.toggleHidden} className="link-button" to={"/planet/" + value.id}><MenuItem icon="globe-network" key={value.id} text={value.name}/></Link>
        ))}
        <Popover 
          className="MainSidebar-insert-planet-popover" 
          modifiers={{preventOverflow: 
            {boundariesElement: 'window'}, 
            hide: {enabled: false}, 
            flip: {behavior: isMobile() ? "flip" : "counterclockwise"}
          }} 
          position={Position.RIGHT} 
          isOpen={showPopout}
          onClose={() => setPopout(false)}
        >
          <MenuItem icon="new-object" text="New Planet" className="MainSidebar-insert-planet-button" onClick={() => {
            setPopout(!showPopout);
            props.toggleHidden();
          }}/>
          <div className="MainSidebar-insert-planet-box">
            <input className={Classes.INPUT} value={planetName} onChange={(e) => setPlanetName(e.target.value)}/>
            <div className="MainSidebar-insert-planet-bottom">
              <Checkbox label="Private" checked={privatePlanet} onChange={() => setPrivate(!privatePlanet)} className="MainSidebar-insert-planet-checkbox" onKeyPress={(e) => {
                if(e.key === "Enter") {
                  createPlanet();
                }
              }}/>
              <Button small={true} className="MainSidebar-insert-planet-submit" text="Create" onClick={createPlanet}/>
            </div>
          </div>
        </Popover>
        {data.currentUser.following && data.currentUser.following.length > 0 && <MenuDivider title="FOLLOWING"/>}
        {data.currentUser.following?.map((value) => (
          <Link onClick={props.toggleHidden} className="link-button" to={"/planet/" + value.id}><MenuItem icon="globe-network" key={value.id} text={value.name}/></Link>
        ))}
      </>}
    </>
  );
}

export default PlanetSwitcher;