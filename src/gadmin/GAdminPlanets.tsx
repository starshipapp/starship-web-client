import { useQuery } from "@apollo/client";
import { faGlobe, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/controls/Button";
import Divider from "../components/display/Divider";
import Textbox from "../components/input/Textbox";
import Page from "../components/layout/Page";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import List from "../components/list/List";
import ListItem from "../components/list/ListItem";
import getAdminPlanets, { IGetAdminPlanetsData } from "../graphql/queries/admin/getAdminPlanets";

function GAdminPlanets(): JSX.Element {
  const [pageNumber, setPage] = useState<number>(0);
  const {data} = useQuery<IGetAdminPlanetsData>(getAdminPlanets, {variables: {startNumber: pageNumber * 25, count: 25}});

  return (
    <Page>
      <PageContainer className="flex flex-col flex-shrink">
        <PageHeader>Planets</PageHeader>
        
        <List
          name="List of planets"
          actions={<div className="space-x-1">
            <Button small onClick={() => setPage(pageNumber - 1)}>Previous</Button>
            <Textbox small value={pageNumber.toString()} onChange={(e) => setPage(!isNaN(parseInt(e.target.value, 10)) ? parseInt(e.target.value, 10) : 0)} />
            <Button small onClick={() => setPage(pageNumber + 1)}>Next</Button>
          </div>}
        >
          {data?.adminPlanets && data?.adminPlanets.map((planet) => (
            <Link to={`/planet/${planet.id}`} className="link-button block overflow-hidden" key={planet.id}>
              <ListItem
                key={planet.id}
                icon={<div className="w-6 flex">
                  <FontAwesomeIcon className="mx-auto" icon={planet.private ? faLock : faGlobe}/>
                </div>}
                className="w-full overflow-hidden max-w-full"
                actions={<div className="flex flex-shrink-0 flex-grow">
                  <div>{planet.owner?.username}</div>
                  <Divider/>
                  <div className="whitespace-nowrap">
                    {new Date(Number(planet.createdAt)).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                  </div>
                </div>}
              >
                <div className="overflow-ellipsis overflow-hidden whitespace-nowrap flex-shrink block w-full">{planet.name}</div>
              </ListItem>
            </Link>
          ))}
        </List>
      </PageContainer>
    </Page>
  );
}

export default GAdminPlanets;
