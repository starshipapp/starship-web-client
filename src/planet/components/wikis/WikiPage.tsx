import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Intent, Popover } from "@blueprintjs/core";
import ReactMarkdown from "react-markdown";
import SimpleMDEEditor from "react-simplemde-editor";
import IPlanet from "../../../types/IPlanet";
import { useMutation, useQuery } from "@apollo/client";
import getWikiPage, { IGetWikiPageData } from "../../../graphql/queries/components/wikis/getWikiPage";
import permissions from "../../../util/permissions";
import getCurrentUser, { IGetCurrentUserData } from "../../../graphql/queries/users/getCurrentUser";
import editorOptions from "../../../util/editorOptions";
import updateWikiPageMutation, { IUpdateWikiPageData } from "../../../graphql/mutations/components/wikis/updateWikiPageMutation";
import { GlobalToaster } from "../../../util/GlobalToaster";
import renameWikiPageMutation, { IRenameWikiPageData } from "../../../graphql/mutations/components/wikis/renameWikiPageMutation";
import removeWikiPageMutation, { IRemoveWikiPageData } from "../../../graphql/mutations/components/wikis/removeWikiPageMutation";
import { useHistory } from "react-router-dom";

interface IWikiPageProps {
  id: string,
  subId: string,
  planet: IPlanet,
  refetch: () => void
}

let prevRenderId = "";

function WikiPage(props: IWikiPageProps): JSX.Element {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingContent, setEditingContent] = useState<string>("");
  const [showRename, setRename] = useState<boolean>(false);
  const [renameTextbox, setRenameText] = useState<string>("");
  const {data: userData} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });
  const {data} = useQuery<IGetWikiPageData>(getWikiPage, {variables: {id: props.subId}});
  const [savePage] = useMutation<IUpdateWikiPageData>(updateWikiPageMutation);
  const [renameWikiPage] = useMutation<IRenameWikiPageData>(renameWikiPageMutation); 
  const [removeWikiPage] = useMutation<IRemoveWikiPageData>(removeWikiPageMutation);
  const history = useHistory();

  useEffect(() => {
    if(prevRenderId !== props.subId) {
      setIsEditing(false);
    }
    prevRenderId = props.subId;
  }, [setIsEditing, props.subId]);

  const renamePage = function() {
    renameWikiPage({variables: {pageId: props.subId, newName: renameTextbox}}).then(() => {
      GlobalToaster.show({message: "Successfully renamed page.", intent: Intent.DANGER});
      setRename(false);
    }).catch((err: Error) => {
      GlobalToaster.show({message: err.message});
    });
  };

  return (
    <div className="bp3-dark PageComponent">
      <h1 className="WikiComponent-header">{data?.wikiPage.name ?? ""}</h1>
      {data?.wikiPage && !isEditing && <ReactMarkdown>{data?.wikiPage?.content ?? ""}</ReactMarkdown>}
      {data?.wikiPage && isEditing && <SimpleMDEEditor onChange={(e) => setEditingContent(e)} value={editingContent} options={editorOptions}/>}
      {(data?.wikiPage && userData?.currentUser && permissions.checkFullWritePermission(userData?.currentUser, props.planet)) && (!isEditing ? <div className="PageComponent-edit PageComponent-edit-button WikiComponent-buttons">
        <ButtonGroup minimal={true} >
          <Button
            icon="edit"
            text="Edit"
            onClick={() => {
              setIsEditing(true);
              setEditingContent(data.wikiPage.content ?? "");
            }}
          />
          <Popover isOpen={showRename}>
            <Button
              icon="new-text-box"
              text="Rename"
              onClick={() => {setRename(true); setRenameText(data.wikiPage?.name ?? "");}}
            />
            <div className="menu-form">
              <input className="menu-input bp3-input" placeholder="Page Name" onKeyDown={(e) => {e.key === "Enter" && renamePage();}} value={renameTextbox} onChange={(e) => setRenameText(e.target.value)}/>
              <Button className="menu-button" onClick={renamePage}>Rename</Button>
            </div>
          </Popover>
          <Popover>
            <Button
              icon="trash"
              text="Delete"
              outlined={true}
              intent={Intent.DANGER}
            />
            <div className="menu-form">
              <p>Are you sure?</p>
              <Button
                icon="trash"
                text="Delete"
                intent={Intent.DANGER}
                onClick={() => {
                  removeWikiPage({variables: {pageId: props.subId}}).then(() => {
                    GlobalToaster.show({message: "Successfully deleted page.", intent: Intent.SUCCESS});
                    props.refetch();
                    history.push(`/planet/${props.planet.id}/${props.id}`);
                  }).catch((err: Error) => {
                    GlobalToaster.show({message: err.message, intent: Intent.DANGER});
                  });
                }}
              />
            </div>
          </Popover>
        </ButtonGroup>
      </div> : <Button
        icon="saved"
        onClick={() => {
          savePage({variables: {pageId: props.subId, newContent: editingContent}}).then(() => {
            GlobalToaster.show({message: `Sucessfully updated ${data.wikiPage.name ?? ""}.`, intent: Intent.SUCCESS});
            setIsEditing(false);
          }).catch((err: Error) => {
            GlobalToaster.show({message: err.message, intent: Intent.DANGER});
          });
        }}
        className="PageComponent-edit PageComponent-edit-button WikiComponent-buttons"
      >
        Save
      </Button>)}
    </div>
  );
}

export default WikiPage;