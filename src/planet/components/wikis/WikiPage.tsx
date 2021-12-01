import { useEffect, useMemo, useState } from "react";
import SimpleMDEEditor from "react-simplemde-editor";
import IPlanet from "../../../types/IPlanet";
import { useMutation, useQuery } from "@apollo/client";
import getWikiPage, { IGetWikiPageData } from "../../../graphql/queries/components/wikis/getWikiPage";
import permissions from "../../../util/permissions";
import getCurrentUser, { IGetCurrentUserData } from "../../../graphql/queries/users/getCurrentUser";
import { assembleEditorOptions } from "../../../util/editorOptions";
import updateWikiPageMutation, { IUpdateWikiPageData } from "../../../graphql/mutations/components/wikis/updateWikiPageMutation";
import renameWikiPageMutation, { IRenameWikiPageData } from "../../../graphql/mutations/components/wikis/renameWikiPageMutation";
import removeWikiPageMutation, { IRemoveWikiPageData } from "../../../graphql/mutations/components/wikis/removeWikiPageMutation";
import { useHistory } from "react-router-dom";
import uploadMarkdownImageMutation, { IUploadMarkdownImageMutationData } from "../../../graphql/mutations/misc/uploadMarkdownImageMutation";
import Markdown from "../../../util/Markdown";
import SubPageHeader from "../../../components/subpage/SubPageHeader";
import NonIdealState from "../../../components/display/NonIdealState";
import { faEdit, faExclamationTriangle, faPencilAlt, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import Toasts from "../../../components/display/Toasts";
import Button from "../../../components/controls/Button";
import Popover from "../../../components/overlays/Popover";
import Textbox from "../../../components/input/Textbox";
import Intent from "../../../components/Intent";

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
  const [showDelete, setDelete] = useState<boolean>(false);
  const {data: userData} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });
  const {data, loading} = useQuery<IGetWikiPageData>(getWikiPage, {variables: {id: props.subId}});
  const [savePage] = useMutation<IUpdateWikiPageData>(updateWikiPageMutation);
  const [renameWikiPage] = useMutation<IRenameWikiPageData>(renameWikiPageMutation); 
  const [removeWikiPage] = useMutation<IRemoveWikiPageData>(removeWikiPageMutation);
  const history = useHistory();
  const [uploadMarkdownImage] = useMutation<IUploadMarkdownImageMutationData>(uploadMarkdownImageMutation);

  useEffect(() => {
    if(prevRenderId !== props.subId) {
      setIsEditing(false);
    }
    prevRenderId = props.subId;
  }, [setIsEditing, props.subId]);


  const memoizedOptions = useMemo(() => assembleEditorOptions(uploadMarkdownImage), [uploadMarkdownImage]);

  const renamePage = function() {
    renameWikiPage({variables: {pageId: props.subId, newName: renameTextbox}}).then(() => {
      Toasts.success(`Renamed page to ${renameTextbox}.`);
      setRename(false);
    }).catch((err: Error) => {
      Toasts.danger(err.message);
    });
  };

  return (
    <div className="w-full">
      {data?.wikiPage && <SubPageHeader className="flex">
        <div>{data.wikiPage.name}</div>
        {userData?.currentUser && permissions.checkFullWritePermission(userData.currentUser, props.planet) && <div className="ml-auto text-sm mt-auto flex">
          {!isEditing && <>
            <Popover
              popoverTarget={<Button
                className="mr-2"
                icon={faPencilAlt}
                onClick={() => setRename(true)}
              >Rename</Button>}
              open={showRename}
              onClose={() => setRename(false)}
            >
              <div>
                <Textbox
                  value={renameTextbox}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRenameText(e.target.value)}
                  placeholder="Page Name"
                  className="mr-2"
                />
                <Button
                  onClick={renamePage}
                >Rename</Button>
              </div>
            </Popover>
            <Button
              className="mr-2"
              icon={faEdit}
              onClick={() => {
                setIsEditing(true);
                setEditingContent(data.wikiPage.content ?? "");
              }}
            >Edit</Button>
            <Popover
              popoverTarget={<Button
                icon={faTrash}
                onClick={() => setDelete(true)}
                intent={Intent.DANGER}
              >Delete</Button>}
              open={showDelete}
              onClose={() => setDelete(false)}
            >
              <Button
                onClick={() => {
                  removeWikiPage({variables: {pageId: props.subId}}).then(() => {
                    Toasts.success(`Removed page ${data.wikiPage.name ?? ""}.`);
                    props.refetch();
                    history.push(`/planet/${props.planet.id}/${props.id}`);
                  }).catch((err: Error) => {
                    Toasts.danger(err.message);
                  });
                }}
                intent={Intent.DANGER}
                icon={faExclamationTriangle}
              >Delete</Button>
            </Popover>
          </>}
          {isEditing && <Button
            icon={faSave}
            onClick={() => {
              savePage({variables: {pageId: props.subId, newContent: editingContent}}).then(() => {
                Toasts.success("Saved page.");
                setIsEditing(false);
              }).catch((err: Error) => {
                Toasts.danger(err.message);
              });
            }}
          >Save</Button>}
        </div>}
      </SubPageHeader>}
      {data?.wikiPage && !isEditing && <Markdown longForm planetEmojis={props.planet.customEmojis}>{data?.wikiPage?.content ?? ""}</Markdown>}
      {data?.wikiPage && isEditing && <SimpleMDEEditor onChange={(e) => setEditingContent(e)} value={editingContent} options={memoizedOptions}/>}
      {!data?.wikiPage && !loading && <NonIdealState
        icon={faExclamationTriangle}
        title="404"
      >We couldn't find that page.</NonIdealState>}
    </div>
  );
}

export default WikiPage;
