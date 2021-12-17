import { useMutation, useQuery } from "@apollo/client";
import { faExclamationTriangle, faFileAlt, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../../components/controls/Button";
import NonIdealState from "../../../components/display/NonIdealState";
import Toasts from "../../../components/display/Toasts";
import Textbox from "../../../components/input/Textbox";
import Page from "../../../components/layout/Page";
import PageContainer from "../../../components/layout/PageContainer";
import PageHeader from "../../../components/layout/PageHeader";
import MenuItem from "../../../components/menu/MenuItem";
import Popover from "../../../components/overlays/Popover";
import SubPage from "../../../components/subpage/SubPage";
import SubPageSidebar from "../../../components/subpage/SubPageSidebar";
import insertWikiPageMutation, { IInsertWikiPageData } from "../../../graphql/mutations/components/wikis/insertWikiPageMutation";
import getWiki, { IGetWikiData } from "../../../graphql/queries/components/wikis/getWiki";
import getCurrentUser, { IGetCurrentUserData } from "../../../graphql/queries/users/getCurrentUser";
import permissions from "../../../util/permissions";
import IComponentProps from "../IComponentProps";
import WikiPage from "./WikiPage";

function WikiComponent(props: IComponentProps): JSX.Element {
  const {data: userData} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });
  const {data: wikiData, refetch} = useQuery<IGetWikiData>(getWiki, {variables: {id: props.id}});
  const hasWritePermission = userData?.currentUser && permissions.checkFullWritePermission(userData.currentUser, props.planet);
  const [insertPage] = useMutation<IInsertWikiPageData>(insertWikiPageMutation);
  const [pageTextbox, setPageTextbox] = useState<string>("");
  const [showNewPage, setNewPage] = useState<boolean>(false);

  const createPage = function() {
    insertPage({variables: {wikiId: props.id, content: "This is a Page. Click the Edit icon in the top right corner to get started.", name: pageTextbox}}).then(() => {
      Toasts.success(`Successfully created page ${pageTextbox}.`);
      setPageTextbox("");
      setNewPage(false);
      void refetch();
    }).catch((err: Error) => {
      Toasts.danger(err.message);
    });
  };

  return (
    <Page>
      <PageContainer>
        <PageHeader>{props.name}</PageHeader>
        <SubPage>
          <SubPageSidebar>
            {wikiData?.wiki?.pages?.map((page) => (
              <Link to={`/planet/${props.planet.id}/${props.id}/${page.id}`} className="link-button"><MenuItem icon={faFileAlt}>{page.name}</MenuItem></Link>
            ))}
            <Popover
              open={showNewPage}
              onClose={() => setNewPage(false)}
              popoverTarget={
                <MenuItem icon={faPlus} onClick={() => setNewPage(true)}>
                  <span>New Page</span>
                </MenuItem>
              }
              className="w-full"
            >
              <Textbox
                value={pageTextbox}
                onChange={(e) => setPageTextbox(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    createPage();
                  }
                }}
                className="mr-2"
              />
              <Button onClick={createPage}>Create</Button>
            </Popover>
          </SubPageSidebar>
          <div className="w-full ml-4">
            {wikiData?.wiki && wikiData.wiki?.pages?.length === 0 && <NonIdealState title="This Page Group is empty." icon={faExclamationTriangle}>
              <p>This page group is empty. Click the plus icon in the sidebar on the left to create a new page.</p>
            </NonIdealState>}
            {wikiData?.wiki && wikiData?.wiki?.pages?.length !== 0 && props.subId && <WikiPage id={props.id} subId={props.subId} planet={props.planet} refetch={refetch}/>}
            {wikiData?.wiki && wikiData?.wiki?.pages?.length !== 0 && !props.subId && <NonIdealState title="No page selected." icon={faFileAlt}>
              <p>Select a page from the sidebar on the left to view it.</p>
            </NonIdealState>}
          </div>
        </SubPage>
      </PageContainer>
    </Page>
  );
}

export default WikiComponent;
