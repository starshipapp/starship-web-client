import { useQuery } from "@apollo/client";
import { Alignment, Button, Menu, MenuItem, Navbar, Popover } from "@blueprintjs/core";
import React from "react";
import { Link, useParams } from "react-router-dom";
import getCurrentUser, { IGetCurrentUserData } from "../graphql/queries/users/getCurrentUser";
import IPlanet from "../types/IPlanet";
import IUser from "../types/IUser";
import permissions from "../util/permissions";
import ComponentIndex from "./ComponentIndex";
import "./css/Planet.css";

interface IPlanetContentParams {
  planet: string,
  component?: string
}

interface IPlanetContentProps {
  home: boolean,
  planet: IPlanet
}

function PlanetContent(props: IPlanetContentProps): JSX.Element {
  const {planet, component} = useParams<IPlanetContentParams>();
  console.log("planet: " + (planet as unknown as string));
  console.log("component: " + (planet as unknown as string));
  const {data: userData, loading: userLoading} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });

  return (
    <>
      <Navbar className="Planet-navbar">
        <div className="Planet-navbar-content">
          <Navbar.Group align={Alignment.LEFT}>
            <Link to={`/planet/${planet}`}> <Button className="bp3-minimal" outlined={props.home} icon="home" text="Home"/> </Link>
            {props.planet.components && props.planet.components.map((value) => (<Link to={`/planet/${planet}/${value.componentId}`}>
              <Button
                className="bp3-minimal"
                icon={ComponentIndex.ComponentDataTypes[value.type].icon}
                text={value.name}
                outlined={component !== undefined && component === value.componentId}
                key={value.componentId}
              />
            </Link>))}
            {!userLoading && props.planet.owner && permissions.checkFullWritePermission(userData?.currentUser as IUser, props.planet) && <Popover>
              <Button className="bp3-minimal" icon="plus"/>
              <div className="Planet-navbar-add-content">
                <input className="bp3-input" placeholder="name"/>
                <Menu>
                  {Object.values(ComponentIndex.ComponentDataTypes).map((value) => (<MenuItem text={"Create new " + value.friendlyName} key={value.name} icon={value.icon}/>))}
                </Menu>
              </div>
            </Popover>}
          </Navbar.Group>
        </div>
      </Navbar>
    </>
  );
}

export default PlanetContent;