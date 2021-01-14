import { useMutation } from "@apollo/client";
import { Button, Classes, Intent, Menu, MenuItem, Popover } from "@blueprintjs/core";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import SimpleMDEEditor from "react-simplemde-editor";
import insertForumPostMutation, { IInsertForumPostMutationData } from "../../../graphql/mutations/components/forums/insertForumPostMutation";
import IForum from "../../../types/IForum";
import editorOptions from "../../../util/editorOptions";
import { GlobalToaster } from "../../../util/GlobalToaster";
import "./css/ForumEditor.css";

interface IForumEditorProps {
  onClose: () => void,
  forum: IForum
}

function ForumEditor(props: IForumEditorProps): JSX.Element {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [insertPost] = useMutation<IInsertForumPostMutationData>(insertForumPostMutation);
  const history = useHistory();

  return (
    <div className="ForumEditor">
      <div className="ForumEditor-title">
        <input className={Classes.INPUT + " ForumEditor-name " + Classes.LARGE} value={name} onChange={(e) => setName(e.target.value)} placeholder="Thread Name"/>
        {props.forum.tags && props.forum.tags.length !== 0 && <Popover>
          <Button large={true} text={activeTag ? activeTag : "Tags"} icon="chevron-down"/>
          <Menu>
            {props.forum.tags.map((value) => (<MenuItem icon={activeTag === value && "tick"} text={value} onClick={() => setActiveTag(value)} key={value}/>))}
          </Menu>
        </Popover>}
      </div>
      <SimpleMDEEditor onChange={(e) => setEditingContent(e)} value={editingContent} options={editorOptions}/>
      <Button text="Post" className="ForumEditor-button" onClick={() => {
        if(editingContent === "") {
          GlobalToaster.show({message: "You must have content in your post.", intent: Intent.DANGER});
          return;
        }
        if(name === "") {
          GlobalToaster.show({message: "Your post must have a name.", intent: Intent.DANGER});
          return;
        }
        insertPost({variables: {forumId: props.forum.id, name, content: editingContent, tag: activeTag}}).then((data) => {
          GlobalToaster.show({message: "Sucessfully created thread.", intent: Intent.SUCCESS});
          history.push(`/planet/${props.forum.planet?.id ?? "uh_oh"}/${props.forum.id}/${data.data?.insertForumPost.id ?? ""}`);
          props.onClose();
        }).catch((err: Error) => {
          GlobalToaster.show({message: err.message, intent: Intent.DANGER});
        });
      }}/>
      <Button text="Cancel" className="ForumEditor-button" onClick={props.onClose}/>
    </div>
  );
}

export default ForumEditor;