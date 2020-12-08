import React, { useState } from "react";
import { Button, ButtonGroup, Intent } from "@blueprintjs/core";
import ReactMarkdown from "react-markdown";
import SimpleMDEEditor from "react-simplemde-editor";
import IPlanet from "../../../types/IPlanet";
import { useQuery } from "@apollo/client";
import getWikiPage, { IGetWikiPageData } from "../../../graphql/queries/components/wikis/getWikiPage";
import permissions from "../../../util/permissions";
import getCurrentUser, { IGetCurrentUserData } from "../../../graphql/queries/users/getCurrentUser";
import editorOptions from "../../../util/editorOptions";

interface IWikiPageProps {
  subId: string,
  planet: IPlanet
}

function WikiPage(props: IWikiPageProps): JSX.Element {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const {data: userData} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });
  const [editingContent, setEditingContent] = useState<string>("");
  const {data} = useQuery<IGetWikiPageData>(getWikiPage, {variables: {id: props.subId}});

  return (
    <div className="bp3-dark PageComponent">
      <h1 className="WikiComponent-header">{data?.wikiPage.name ?? ""}</h1>
      {data?.wikiPage && !isEditing && <ReactMarkdown>{data?.wikiPage?.content ?? ""}</ReactMarkdown>}
      {data?.wikiPage && isEditing && <SimpleMDEEditor onChange={(e) => setEditingContent(e)} value={editingContent} options={editorOptions}/>}
      {(data?.wikiPage && userData?.currentUser && permissions.checkFullWritePermission(userData?.currentUser, props.planet)) && (!isEditing ? <div className="PageComponent-edit PageComponent-edit-button WikiComponent-buttons">
        <ButtonGroup minimal={true}>
          <Button
            icon="edit"
            text="Edit"
            onClick={() => {
              setIsEditing(true);
              setEditingContent(data.wikiPage.content ?? "");
            }}
          />
          <Button
            icon="new-text-box"
            text="Rename"
          />
          <Button
            icon="trash"
            text="Delete"
            intent={Intent.DANGER}
          />
        </ButtonGroup>
      </div> : <Button
        icon="saved"
        onClick={() => {/* tbi*/}}
        className="PageComponent-edit PageComponent-edit-button WikiComponent-buttons"
      >
        Save
      </Button>)}
    </div>
  );
}

export default WikiPage;