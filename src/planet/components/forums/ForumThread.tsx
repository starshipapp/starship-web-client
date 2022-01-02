import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useMemo, useState } from "react";
import getForumPost, { IGetForumPostData } from "../../../graphql/queries/components/forums/getForumPost";
import IForum from "../../../types/IForum";
import IPlanet from "../../../types/IPlanet";
import ReactPaginate from "react-paginate";
import SimpleMDEEditor from "react-simplemde-editor";
import getCurrentUser, { IGetCurrentUserData } from "../../../graphql/queries/users/getCurrentUser";
import permissions from "../../../util/permissions";
import { assembleEditorOptions } from "../../../util/editorOptions";
import insertForumReplyMutation, { IInsertForumReplyMutationData } from "../../../graphql/mutations/components/forums/insertForumReplyMutation";
import IForumItem from "../../../types/IForumItem";
import ForumThreadItem from "./ForumThreadItem";
import uploadMarkdownImageMutation, { IUploadMarkdownImageMutationData } from "../../../graphql/mutations/misc/uploadMarkdownImageMutation";
import { useNavigate } from "react-router-dom";
import SubPageHeader from "../../../components/subpage/SubPageHeader";
import NonIdealState from "../../../components/display/NonIdealState";
import { faCaretLeft, faCaretRight, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Toasts from "../../../components/display/Toasts";
import Button from "../../../components/controls/Button";
import PageSubheader from "../../../components/layout/PageSubheader";
import Divider from "../../../components/display/Divider";

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
  const {data: postData, refetch, loading} = useQuery<IGetForumPostData>(getForumPost, {variables: {id: props.postId, count: 25, cursor: (props.page ? String(Number(props.page) * 25 - 25) : "0")}});
  const [editingContent, setEditingContent] = useState<string>("");
  const [demandValueChange, setDemandValueChange] = useState<boolean>(false);
  const [insertReply] = useMutation<IInsertForumReplyMutationData>(insertForumReplyMutation);
  const [uploadMarkdownImage] = useMutation<IUploadMarkdownImageMutationData>(uploadMarkdownImageMutation);
  const memoizedOptions = useMemo(() => assembleEditorOptions(uploadMarkdownImage), [uploadMarkdownImage]);
  const navigate = useNavigate();

  useEffect(() => {
    if(demandValueChange && mdeInstance) {
      mdeInstance.value(editingContent);
      setDemandValueChange(false); 
    }
  }, [demandValueChange, editingContent]);


  const buttonBase = `transition-all duration-200 text-black leading-tight flex-shrink-0
  outline-none focus:outline-none focus:ring-blue-300 focus:ring-1 dark:focus:ring-blue-600 
  dark:text-white block`;
  const buttonLink = `link-button block px-3 py-1.5`;
  const buttonRegular = `bg-gray-200 border-gray-300 hover:bg-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 active:bg-gray-400 dark:active:bg-gray-800`;
  const buttonPrimary = `bg-blue-400 border-gray-300 hover:bg-blue-500 dark:bg-blue-700 dark:border-gray-600 dark:hover:bg-blue-600 active:bg-blue-600 dark:active:bg-blue-800`;

  return (
    <div className="w-full flex flex-col mb-4">
      <SubPageHeader className="leading-none">{postData?.forumPost && postData.forumPost.name}</SubPageHeader>
      <Divider/>
      <div className="w-full mt-2">
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
        {postData?.forumPost && <div className="mb-3">
          {postData?.forumPost.replies && postData?.forumPost.replies.forumReplies.map((value) => (<ForumThreadItem 
            key={value.id}
            forumId={props.forum.id} 
            refetch={() => void refetch()} 
            planet={props.planet}
            post={value}
            isParent={false}
            addQuote={(post: IForumItem) => {
              const quote = `> ${post.content?.split("\n").join("\n> ") ?? "nullq"}`;
              setEditingContent(editingContent + quote + "\n \n");
              setDemandValueChange(true);
            }}
            forumRefetch={() => props.forumRefetch()}
          />))}
        </div>}
        {!postData?.forumPost && !loading && <NonIdealState
          title="404"
          icon={faExclamationTriangle}
        >This forum post doesn't exist.</NonIdealState>}
        {/* <ForumThreadItemContainer page={this.props.page ? Number(this.props.page) : 1} addQuote={this.addQuote} planet={this.props.planet} post={postData.forumPost}/>*/}
      </div>
      {postData?.forumPost && (postData.forumPost.replyCount ?? 0) > 25 && <ReactPaginate
        previousLabel={<FontAwesomeIcon icon={faCaretLeft}/>}
        nextLabel={<FontAwesomeIcon icon={faCaretRight}/>}
        breakLabel="..."
        pageCount={Math.ceil((postData.forumPost.replyCount ?? 0) / 25)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={(page) => {
          navigate(`/planet/${props.planet.id}/${props.forum.id}/${props.postId}/${page.selected + 1}`);
        }}
        initialPage={Number(props.page) - 1}
        disableInitialCallback={true}
        containerClassName="rounded w-max border border-gray-300 dark:border-gray-600 flex text-black dark:text-white"
        breakClassName={`${buttonBase} ${buttonRegular} border-r disabled opacity-75 cursor-not-allowed`}
        activeClassName={`${buttonBase} ${buttonPrimary} border-r`}
        pageClassName={`${buttonBase} ${buttonRegular} border-r`}
        previousClassName={`${buttonBase} ${buttonRegular} border-r`}
        nextClassName={`${buttonBase} ${buttonRegular}`}
        pageLinkClassName={buttonLink}
        nextLinkClassName={buttonLink}
        previousLinkClassName={buttonLink}
        breakLinkClassName={buttonLink}
      />}
      {postData?.forumPost && data?.currentUser && (!postData.forumPost.locked || permissions.checkFullWritePermission(data.currentUser, props.planet)) && <div className="w-full">
        <PageSubheader>Reply</PageSubheader> 
        <SimpleMDEEditor
          onChange={(e) => setEditingContent(e)}
          value={editingContent} 
          getMdeInstance={(instance) => mdeInstance = instance}
          options={memoizedOptions}
        />
        <Button className="block -mt-4" onClick={() => {
          if(editingContent === "") {
            Toasts.danger("Your reply must not be empty.");
            return;
          }
          insertReply({variables: {postId: props.postId, content: editingContent}}).then(() => {
            Toasts.success("Successfully replied to post.");
            void refetch();
            setEditingContent("");
            setDemandValueChange(true);
          }).catch((err: Error) => {
            Toasts.danger(err.message);
          });
        }}>Reply</Button>
      </div>}
    </div>
  );
}

export default ForumThread;
