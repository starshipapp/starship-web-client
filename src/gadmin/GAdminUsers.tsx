import { useQuery } from "@apollo/client";
import { Button, ButtonGroup, Classes, Popover } from "@blueprintjs/core";
import React, { useState } from "react";
import getAdminUsers, { IGetAdminUsersData } from "../graphql/queries/admin/getAdminUsers";
import Profile from "../profile/Profile";

function GAdminUsers(): JSX.Element {
  const [pageNumber, setPage] = useState<number>(0);
  const {data} = useQuery<IGetAdminUsersData>(getAdminUsers, {variables: {startNumber: pageNumber * 25, count: 25}});
  const [openUser, setUser] = useState<string>("");

  return (
    <div className="GAdmin-page bp3-dark">
      <div className="GAdmin-page-header">Users</div>
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
                Username
              </td>
              <td>
                Registration Date
              </td>
              <td>
                Banned?
              </td>
            </tr>
          </thead>
          {data?.adminUsers && <tbody>
          {data.adminUsers.map((value) => (<>
            <Profile 
              isOpen={openUser === value.id}
              userId={value.id}
              onClose={() => setUser("")}
            />
            <tr onClick={() => setUser(value.id)}>
              <td>
                {value.username}
              </td>
              <td>
                {new Date(Number(value.createdAt)).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </td>
              <td>
                {value.banned ? "Banned" : "Not Banned"}
              </td>
            </tr>
          </>))}  
        </tbody>}
        </table>
      </div>
    </div>
  );
}

export default GAdminUsers;
