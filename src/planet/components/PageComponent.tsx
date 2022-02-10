import { useMutation, useQuery } from "@apollo/client";
import { useMemo, useState } from "react";
import SimpleMDEEditor from "react-simplemde-editor";
import getPage, { IGetPageData } from "../../graphql/queries/components/getPage";
import getCurrentUser, { IGetCurrentUserData } from "../../graphql/queries/users/getCurrentUser";
import { assembleEditorOptions } from "../../util/editorOptions";
import permissions from "../../util/permissions";
import "easymde/dist/easymde.min.css";
import IComponentProps from "./IComponentProps";
import updatePageMutation, { IUpdatePageMutationData } from "../../graphql/mutations/components/updatePageMutation";
import uploadMarkdownImageMutation, { IUploadMarkdownImageMutationData } from "../../graphql/mutations/misc/uploadMarkdownImageMutation";
import Markdown from "../../util/Markdown";
import Page from "../../components/layout/Page";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/controls/Button";
import { faEdit, faSave } from "@fortawesome/free-solid-svg-icons";
import Toasts from "../../components/display/Toasts";
import PageContainer from "../../components/layout/PageContainer";
import Editor from "../../editor/Editor";

function PageComponent(props: IComponentProps): JSX.Element {
  const {data} = useQuery<IGetPageData>(getPage, {variables: {page: props.id}});
  const [isEditing, setEditing] = useState<boolean>(false);
  const [editorState, setEditorState] = useState<string>("");
  const {data: userData} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });
  const [updatePage] = useMutation<IUpdatePageMutationData>(updatePageMutation);
  const [uploadMarkdownImage] = useMutation<IUploadMarkdownImageMutationData>(uploadMarkdownImageMutation);

  const memoizedOptions = useMemo(() => assembleEditorOptions(uploadMarkdownImage), [uploadMarkdownImage]);

  return (
    <Page>
      <PageContainer>
        {data?.page && <>
          <PageHeader>
            <span>{props.name}</span>
            <div className="inline-block text-sm mt-auto ml-1 mb-0.5">
              {(userData?.currentUser && permissions.checkFullWritePermission(userData?.currentUser, props.planet)) && (!isEditing ? <Button
                icon={faEdit}
                onClick={() => {
                  setEditing(true);
                  setEditorState(data?.page.content);
                }}
                minimal
              >Edit</Button> : <Button
                icon={faSave}
                onClick={() => {
                  updatePage({variables: {pageId: props.id, content: editorState}}).then(() => {
                    Toasts.success(`Updated ${props.name}.`);
                    setEditing(false);
                  }).catch((error: Error) => {
                    Toasts.danger(error.message);
                  });
                }}
                minimal
              >
                Save
              </Button>)}
            </div>
          </PageHeader>
          {!isEditing && <Markdown planetEmojis={props.planet.customEmojis} longForm>{data.page.content}</Markdown>}
          {/* isEditing && <SimpleMDEEditor onChange={(e) => setEditorState(e)} value={editorState} options={memoizedOptions}/> */}
          {isEditing && <Editor initialMarkdown={editorState}/>}
        </>}
      </PageContainer>
    </Page>
  );
}

export default PageComponent;
