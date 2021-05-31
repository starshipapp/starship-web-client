import { useMutation, useQuery } from "@apollo/client";
import { Button, Intent, Menu, NonIdealState, Popover } from "@blueprintjs/core";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import insertWikiPageMutation, { IInsertWikiPageData } from "../../../graphql/mutations/components/wikis/insertWikiPageMutation";
import getWiki, { IGetWikiData } from "../../../graphql/queries/components/wikis/getWiki";
import getCurrentUser, { IGetCurrentUserData } from "../../../graphql/queries/users/getCurrentUser";
import { GlobalToaster } from "../../../util/GlobalToaster";
import isMobile from "../../../util/isMobile";
import permissions from "../../../util/permissions";
import IComponentProps from "../IComponentProps";
import "./css/WikiComponent.css";
import WikiPage from "./WikiPage";

function WikiComponent(props: IComponentProps): JSX.Element {
  const {data: userData} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });
  const {data: wikiData, refetch} = useQuery<IGetWikiData>(getWiki, {variables: {id: props.id}});
  const hasWritePermission = userData?.currentUser && permissions.checkFullWritePermission(userData.currentUser, props.planet);
  const [insertPage] = useMutation<IInsertWikiPageData>(insertWikiPageMutation);
  const [pageTextbox, setPageTextbox] = useState<string>("");
  const [showNewPage, setNewPage] = useState<boolean>(false);
  const [showSidebar, setSidebar] = useState<boolean>(!isMobile());

  const createPage = function() {
    insertPage({variables: {wikiId: props.id, content: "This is a Page. Click the Edit icon in the top right corner to get started.", name: pageTextbox}}).then(() => {
      GlobalToaster.show({message: `Sucessfully created ${pageTextbox}.`, intent: Intent.SUCCESS});
      setPageTextbox("");
      setNewPage(false);
      void refetch();
    }).catch((err: Error) => {
      GlobalToaster.show({message: err.message, intent: Intent.DANGER});
    });
  };

  const toggleSidebar = function() {
    if(isMobile()) {
      setSidebar(!showSidebar);
    }
  };

  return (
    <div className="bp3-dark WikiComponent">
      <h1><Button icon="menu" onClick={toggleSidebar} minimal={true} className="sidebar-mobile-button"/>{props.name}</h1>
      {wikiData?.wiki && wikiData.wiki.pages?.length === 0 && <div>
        <NonIdealState
          icon="error"
          title="No pages!"
          description={"This page group contains no pages!"}
          action={(hasWritePermission && <Popover>
            <Button>Create new page</Button>
            <div className="menu-form">
              <input className="menu-input bp3-input" placeholder="Page Name" onKeyDown={(e) => {e.key === "Enter" && createPage();}} value={pageTextbox} onChange={(e) => setPageTextbox(e.target.value)}/>
              <Button className="menu-button" onClick={createPage}>Create Page</Button>
            </div>
          </Popover>) as JSX.Element | undefined}
        />
      </div>}
      {showSidebar && <div className="WikiComponent-background" onClick={toggleSidebar}/>}
      {wikiData?.wiki && wikiData.wiki.pages?.length !== 0 && <div className="WikiComponent-container">
        <div className={isMobile() ? (showSidebar ? "sidebar sidebar-mobile" : "sidebar sidebar-hidden") : "sidebar"}>
          <Menu>
            {wikiData?.wiki && wikiData.wiki.pages?.map((value) => (<Link onClick={toggleSidebar} className="link-button" key={value.id} to={`/planet/${props.planet.id}/${props.id}/${value.id ?? ""}`}><Menu.Item icon="document" text={value.name}/></Link>))}
            {hasWritePermission && <Popover isOpen={showNewPage}>
              <Menu.Item icon="plus" text="New Page" onClick={() => {setNewPage(true); setPageTextbox("");}}/>
              <div className="menu-form">
                <input className="menu-input bp3-input" placeholder="Page Name" value={pageTextbox} onChange={(e) => setPageTextbox(e.target.value)} onKeyDown={(e) => {e.key === "Enter" && createPage();}}/>
                <Button className="menu-button" onClick={createPage}>Create Page</Button>
              </div>
            </Popover>}
          </Menu>
        </div>
        <div className="WikiComponent-main">
          {!props.subId && <NonIdealState
            icon="applications"
            title="No page selected"
            description="Select a page from the right to view it."
          />}
          {props.subId && <WikiPage id={props.id} subId={props.subId} planet={props.planet} refetch={refetch}/>}
        </div>
      </div>}
    </div>
  );
}

export default WikiComponent;