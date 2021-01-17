import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import getForumPost, { IGetForumPostData } from "../../../graphql/queries/components/forums/getForumPost";
import IForum from "../../../types/IForum";
import IPlanet from "../../../types/IPlanet";
import ReactPaginate from "react-paginate";
import SimpleMDEEditor from "react-simplemde-editor";
import getCurrentUser, { IGetCurrentUserData } from "../../../graphql/queries/users/getCurrentUser";
import permissions from "../../../util/permissions";
import { Button, Intent } from "@blueprintjs/core";
import editorOptions from "../../../util/editorOptions";
import insertForumReplyMutation, { IInsertForumReplyMutationData } from "../../../graphql/mutations/components/forums/insertForumReplyMutation";
import { GlobalToaster } from "../../../util/GlobalToaster";
import { useHistory } from "react-router-dom";
import IForumItem from "../../../types/IForumItem";
import ForumThreadItem from "./ForumThreadItem";
import "./css/ForumThread.css";

interface IForumThreadProps {
  planet: IPlanet,
  componentId: string,
  postId: string,
  page?: string,
  forum: IForum,
  forumRefetch: () => void
}

let mdeInstance: EasyMDE | null = null;

function ForumThread(props: IForumThreadProps): JSX.Element {
  const {data} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });
  const {data: postData, refetch} = useQuery<IGetForumPostData>(getForumPost, {variables: {id: props.postId, count: 25, cursor: (props.page ? String(Number(props.page) * 25 - 25) : "0")}});
  const [editingContent, setEditingContent] = useState<string>("");
  const [demandValueChange, setDemandValueChange] = useState<boolean>(false);
  const [insertReply] = useMutation<IInsertForumReplyMutationData>(insertForumReplyMutation);
  const history = useHistory();

  useEffect(() => {
    if(demandValueChange && mdeInstance) {
      mdeInstance.value(editingContent);
      setDemandValueChange(false); 
    }
  }, [demandValueChange, editingContent]);

  return (
    <div className="ForumThread">
      <div className="ForumThread-name">{postData?.forumPost && postData.forumPost.name}</div>
      <div className="ForumThread-container">
        {postData?.forumPost && (props.page ? Number(props.page) : 1) === 1 && <ForumThreadItem 
          forumId={props.forum.id} 
          refetch={() => void refetch()} 
          post={postData.forumPost}
          planet={props.planet}
          isParent={true}
          addQuote={(post: IForumItem) => {
            const quote = `> ${post.content?.split("\n").join("\n> ") ?? "nullq"}`;
            setEditingContent(editingContent + quote + "\n \n");
            setDemandValueChange(true);
          }}
          forumRefetch={() => props.forumRefetch()}
        />}
        {/* <ForumThreadItemContainer page={this.props.page ? Number(this.props.page) : 1} addQuote={this.addQuote} planet={this.props.planet} post={postData.forumPost}/>*/}
      </div>
      {postData?.forumPost && (postData.forumPost.replyCount ?? 0) > 25 && <ReactPaginate
        previousLabel="<"
        nextLabel=">"
        breakLabel="..."
        breakClassName="bp3-button bp3-disabled pagination-button"
        pageCount={Math.ceil((postData.forumPost.replyCount ?? 0) / 25)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={(page) => {
          history.push(`/planet/${props.planet.id}/${props.forum.id}/${props.postId}/${page.selected + 1}`);
        }}
        initialPage={Number(props.page) - 1}
        disableInitialCallback={true}
        containerClassName="pagination bp3-button-group"
        activeClassName="bp3-button bp3-disabled pagination-button"
        pageClassName="bp3-button pagination-button"
        previousClassName="bp3-button pagination-button"
        nextClassName="bp3-button pagination-button"
        pageLinkClassName="pagination-link"
        nextLinkClassName="pagination-link"
        previousLinkClassName="pagination-link"
        breakLinkClassName="pagination-link"
      />}
      {postData?.forumPost && data?.currentUser && (!postData.forumPost.locked || permissions.checkFullWritePermission(data.currentUser, props.planet)) && <div className="ForumThread-reply-editor">
        <div className="ForumThread-reply">Reply</div>
        <SimpleMDEEditor
          onChange={(e) => setEditingContent(e)}
          value={editingContent} 
          getMdeInstance={(instance) => mdeInstance = instance}
          options={editorOptions}/>
        <Button text="Post" className="ForumEditor-button" onClick={() => {
          if(editingContent === "") {
            GlobalToaster.show({message: "Your reply must have content.", intent: Intent.DANGER});
          }
          insertReply({variables: {postId: props.postId, content: editingContent}}).then(() => {
            GlobalToaster.show({message: "Reply created.", intent: Intent.SUCCESS});
            void refetch();
            setEditingContent("");
            setDemandValueChange(true);
          }).catch((err: Error) => {
            GlobalToaster.show({message: err.message, intent: Intent.DANGER});
          });
        }}/>
      </div>}
    </div>
  );
}

export default ForumThread;