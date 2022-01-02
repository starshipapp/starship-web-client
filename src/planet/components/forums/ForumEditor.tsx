import { useMutation } from "@apollo/client";
import { faCaretDown, faCheck, faGlobe, faTag } from "@fortawesome/free-solid-svg-icons";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SimpleMDEEditor from "react-simplemde-editor";
import Button from "../../../components/controls/Button";
import Toasts from "../../../components/display/Toasts";
import Textbox from "../../../components/input/Textbox";
import MenuItem from "../../../components/menu/MenuItem";
import Popover from "../../../components/overlays/Popover";
import insertForumPostMutation, { IInsertForumPostMutationData } from "../../../graphql/mutations/components/forums/insertForumPostMutation";
import uploadMarkdownImageMutation, { IUploadMarkdownImageMutationData } from "../../../graphql/mutations/misc/uploadMarkdownImageMutation";
import IForum from "../../../types/IForum";
import { assembleEditorOptions } from "../../../util/editorOptions";

interface IForumEditorProps {
  onClose: () => void,
  forum: IForum
}

function ForumEditor(props: IForumEditorProps): JSX.Element {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [editingTag, setEditingTag] = useState<boolean>(false);
  const [editingContent, setEditingContent] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [insertPost] = useMutation<IInsertForumPostMutationData>(insertForumPostMutation);
  const [uploadMarkdownImage] = useMutation<IUploadMarkdownImageMutationData>(uploadMarkdownImageMutation);

  const navigate = useNavigate();
  const memoizedOptions = useMemo(() => assembleEditorOptions(uploadMarkdownImage), [uploadMarkdownImage]);

  return (
    <div className="w-full px-4">
      <div className="flex mb-3">
        <Textbox
          className="w-full"
          placeholder="Name"
          value={name}
          large
          onChange={(e) => setName(e.target.value)}
        />
        {props.forum.tags && props.forum.tags.length > 0 && <div className="ml-2">
          <Popover
            popoverTarget={<Button
              className="h-full"
              large
              onClick={() => setEditingTag(true)}
              rightIcon={faCaretDown}
            >{activeTag ? activeTag : "Tags"}</Button>}
            onClose={() => setEditingTag(false)} 
            open={editingTag}
            className="h-full flex-shrink-0 w-max"
            popoverClassName="px-0 py-1"
          >
            <div>
              <MenuItem
                icon={activeTag === null ? faCheck : faGlobe}
                onClick={() => setActiveTag(null)}
              >None</MenuItem>
              {props.forum.tags.map((value) => (<MenuItem
                icon={activeTag === value ? faCheck : faTag}
                onClick={() => setActiveTag(value)}
                key={value}
              >{value}</MenuItem>))}
            </div>
          </Popover>
        </div>}
      </div>
      <SimpleMDEEditor onChange={(e) => setEditingContent(e)} value={editingContent} options={memoizedOptions}/>
      <div className="-mt-4">
        <Button onClick={() => {
          if(editingContent === "") {
            Toasts.danger("Your post must not be empty.");
            return;
          }
          if(name === "") {
            Toasts.danger("Your post must have a name.");
            return;
          }
          insertPost({variables: {forumId: props.forum.id, name, content: editingContent, tag: activeTag}}).then((data) => {
            Toasts.success(`Successfully created '${name}'.`);
            navigate(`/planet/${props.forum.planet?.id ?? "uh_oh"}/${props.forum.id}/${data.data?.insertForumPost.id ?? ""}`);
            props.onClose();
          }).catch((err: Error) => {
            Toasts.danger(err.message);
          });
        }}>Post</Button>
        <Button className="ml-2" onClick={props.onClose}>Cancel</Button>
      </div>
    </div>
  );
}

export default ForumEditor;
