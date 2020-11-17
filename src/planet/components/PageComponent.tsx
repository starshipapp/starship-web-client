import { useMutation, useQuery } from "@apollo/client";
import { Button, Intent, NonIdealState } from "@blueprintjs/core";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import SimpleMDEEditor from "react-simplemde-editor";
import getPage, { IGetPageData } from "../../graphql/queries/components/getPage";
import getCurrentUser, { IGetCurrentUserData } from "../../graphql/queries/users/getCurrentUser";
import editorOptions from "../../util/editorOptions";
import permissions from "../../util/permissions";
import "easymde/dist/easymde.min.css";
import "./css/PageComponent.css";
import IComponentProps from "./IComponentProps";
import updatePageMutation, { IUpdatePageMutationData } from "../../graphql/mutations/components/updatePageMutation";
import { GlobalToaster } from "../../util/GlobalToaster";

function PageComponent(props: IComponentProps): JSX.Element {
  const {data, loading } = useQuery<IGetPageData>(getPage, {variables: {page: props.id}});
  const [isEditing, setEditing] = useState<boolean>(false);
  const [editorState, setEditorState] = useState<string>("");
  const {data: userData} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });
  const [updatePage] = useMutation<IUpdatePageMutationData>(updatePageMutation);

  useEffect(() => {
    if(!loading && data?.page && editorState === "") {
      setEditorState(data?.page.content);
    }
  }, [loading, data?.page, editorState]);

  return (
    <div className="bp3-dark PageComponent">
      {loading ? <div></div> : (data?.page ? <>
        {!isEditing && <ReactMarkdown>{data.page.content}</ReactMarkdown>}
        {isEditing && <SimpleMDEEditor onChange={(e) => setEditorState(e)} value={editorState} options={editorOptions}/>}
        {(userData?.currentUser && permissions.checkFullWritePermission(userData?.currentUser, props.planet)) && (!isEditing ? <Button
          icon="edit"
          onClick={() => setEditing(true)}
          minimal={true}
          className="PageComponent-edit PageComponent-edit-button"
        /> : <Button
          icon="saved"
          onClick={() => {
            updatePage({variables: {pageId: props.id, content: editorState}}).then((value) => {
              setEditing(false);
            }).catch((error: Error) => {
              GlobalToaster.show({message: error.message, intent: Intent.DANGER});
            });
          }}
          className="PageComponent-edit PageComponent-save-button"
        >
          Save
        </Button>)}
      </> : <NonIdealState
        title="404"
        icon="warning-sign"
        description="We couldn't find this page."
      />)}
    </div>
  );
}

export default PageComponent;