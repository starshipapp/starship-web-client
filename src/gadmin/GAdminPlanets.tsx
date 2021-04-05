import { useQuery } from "@apollo/client";
import { Button, ButtonGroup, Classes, Popover } from "@blueprintjs/core";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import getAdminPlanets, { IGetAdminPlanetsData } from "../graphql/queries/admin/getAdminPlanets";
import "./css/GAdmin-page.css";

function GAdminPlanets(): JSX.Element {
  const [pageNumber, setPage] = useState<number>(0);
  const {data} = useQuery<IGetAdminPlanetsData>(getAdminPlanets, {variables: {startNumber: pageNumber * 25, count: 25}});

  return (
    <div className="GAdmin-page bp3-dark">
      <div className="GAdmin-page-header">Planets</div>
      <ButtonGroup minimal={true} className="GAdmin-page-buttongroup">
        <Popover>
          <Button rightIcon="caret-down">Set Page</Button>
          <div className="menu-form">
            <input className={Classes.INPUT + " menu-input"} onChange={(e) => setPage(Number(e.target.value))} value={pageNumber}/>
          </div>
        </Popover>
      </ButtonGroup>
      <div className="GAdmin-page-container">
        <table className={`${Classes.HTML_TABLE} GAdmin-page-table`}>
          <thead>
            <tr>
              <td>
                Name
              </td>
              <td>
                Followers
              </td>
              <td>
                Owner
              </td>
              <td>
                Creation Date
              </td>
              <td>
                Components
              </td>
              <td>
                Members
              </td>
              <td>
                Private?
              </td>
            </tr>
          </thead>
          {data?.adminPlanets && <tbody>
          {data.adminPlanets.map((value) => (<>
            <tr>
              <td>
              <Link to={`/planet/${value.id}`}>{value.name}</Link>
              </td>
              <td>
                {value.followerCount}
              </td>
              <td>
                {value.owner?.username}
              </td>
              <td>
                {new Date(Number(value.createdAt)).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </td>
              <td>
                {value.components?.length}
              </td>
              <td>
                {value.members?.length}
              </td>
              <td>
                {value.private ? "Private" : "Public"}
              </td>
            </tr>
          </>))}  
        </tbody>}
        </table>
      </div>
    </div>
  );
}

export default GAdminPlanets;