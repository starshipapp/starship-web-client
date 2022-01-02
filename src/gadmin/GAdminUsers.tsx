import { useQuery } from "@apollo/client";
import { faBan, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Button from "../components/controls/Button";
import Textbox from "../components/input/Textbox";
import Page from "../components/layout/Page";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import List from "../components/list/List";
import ListItem from "../components/list/ListItem";
import getAdminUsers, { IGetAdminUsersData } from "../graphql/queries/admin/getAdminUsers";
import Profile from "../profile/Profile";

function GAdminUsers(): JSX.Element {
  const [pageNumber, setPage] = useState<number>(0);
  const {data} = useQuery<IGetAdminUsersData>(getAdminUsers, {variables: {startNumber: pageNumber * 25, count: 25}});
  const [openUser, setUser] = useState<string>("");

  return (
    <Page>
      <PageContainer>
        <PageHeader>Users</PageHeader>
        <Profile 
          isOpen={openUser !== ""}
          userId={openUser}
          onClose={() => setUser("")}
        />
        <List
          name="List of users"
          actions={<div className="space-x-1">
            <Button small onClick={() => setPage(pageNumber - 1)}>Previous</Button>
            <Textbox small value={pageNumber.toString()} onChange={(e) => setPage(!isNaN(parseInt(e.target.value, 10)) ? parseInt(e.target.value, 10) : 0)} />
            <Button small onClick={() => setPage(pageNumber + 1)}>Next</Button>
          </div>}
        >
          {data?.adminUsers && data?.adminUsers.map((user) => (
            <ListItem
              key={user.id}
              icon={<div className="w-6 flex">
                <FontAwesomeIcon className="mx-auto" icon={user.banned ? faBan : faUser}/>
              </div>}
              onClick={() => setUser(user.id)}
              className="w-full overflow-hidden max-w-full cursor-pointer"
              actions={<div className="flex flex-shrink-0 flex-grow">
                <div className="whitespace-nowrap">
                  {new Date(Number(user.createdAt)).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </div>
              </div>}
            >
              <div className="overflow-ellipsis overflow-hidden whitespace-nowrap flex-shrink block w-full">{user.username}</div>
            </ListItem>
          ))}
        </List>

      </PageContainer>
    </Page>
  );
}

export default GAdminUsers;
