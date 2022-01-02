import { useMutation, useQuery } from "@apollo/client";
import { useMemo, useState } from "react";
import SimpleMDEEditor from "react-simplemde-editor";
import getCurrentUser, { IGetCurrentUserData } from "../../../graphql/queries/users/getCurrentUser";
import Profile from "../../../profile/Profile";
import IForumItem from "../../../types/IForumItem";
import IForumPost from "../../../types/IForumPost";
import IPlanet from "../../../types/IPlanet";
import permissions from "../../../util/permissions";
import ReportDialog from "../../ReportDialog";
import { BaseEmoji, Picker } from "emoji-mart";
import { Twemoji } from "react-emoji-render";
import { reportObjectType } from "../../../util/reportTypes";
import deleteForumPostMutation, { IDeleteForumPostMutationData } from "../../../graphql/mutations/components/forums/deleteForumPostMutation";
import deleteForumReplyMutation, { IDeleteForumReplyMutationData } from "../../../graphql/mutations/components/forums/deleteForumReplyMutation";
import forumPostReactMutation, { IForumPostReactMutationData } from "../../../graphql/mutations/components/forums/forumPostReactMutation";
import forumReplyReactMutation, { IForumReplyReactMutationData } from "../../../graphql/mutations/components/forums/forumReplyReactMutation";
import lockForumPostMutation, { ILockForumPostMutationData } from "../../../graphql/mutations/components/forums/lockForumPostMutation";
import stickyForumPostMutation, { IStickyForumPostMutationData } from "../../../graphql/mutations/components/forums/stickyForumPostMutation";
import updateForumPostMutation, { IUpdateForumPostMutationData } from "../../../graphql/mutations/components/forums/updateForumPostMutation";
import updateForumReplyMutation, { IUpdateForumReplyMutationData } from "../../../graphql/mutations/components/forums/updateForumReplyMutation";
import "emoji-mart/css/emoji-mart.css";
import uploadMarkdownImageMutation, { IUploadMarkdownImageMutationData } from "../../../graphql/mutations/misc/uploadMarkdownImageMutation";
import { assembleEditorOptions } from "../../../util/editorOptions";
import fixPFP from "../../../util/fixPFP";
import Markdown from "../../../util/Markdown";
import generateEmojiMartEmojis from "../../../util/generateEmojiMartEmojis";
import getSysInfo, { IGetSysInfoData } from "../../../graphql/queries/misc/getSysInfo";
import { useNavigate } from "react-router-dom";
import { faEdit, faEllipsisH, faFlag, faLock, faQuoteLeft, faSave, faShieldAlt, faSmile, faThumbtack, faTrash, faUserAstronaut } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../components/controls/Button";
import Tooltip from "../../../components/display/Tooltip";
import Intent from "../../../components/Intent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Popover from "../../../components/overlays/Popover";
import MenuItem from "../../../components/menu/MenuItem";
import Toasts from "../../../components/display/Toasts";

interface IForumThreadItemProps {
  forumId: string
  post: IForumItem
  planet: IPlanet
  isParent: boolean
  addQuote: (post: IForumItem) => void
  refetch: () => void
  forumRefetch: () => void
}

function ForumThreadItem(props: IForumThreadItemProps): JSX.Element {
  const {data} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });
  const {data: sysData} = useQuery<IGetSysInfoData>(getSysInfo);
  const [textValue, setTextValue] = useState<string>(props.post.content ?? "");
  const [showEditor, setEditor] = useState<boolean>(false);
  const [showEmojiPrompt, setEmojiPrompt] = useState<boolean>(false);
  const [showBottomEmojiPrompt, setBottomEmojiPrompt] = useState<boolean>(false);
  const [showProfile, setProfile] = useState<boolean>(false);
  const [showReport, setReport] = useState<boolean>(false);
  const [showAnyways, setShowAnyways] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [deleteForumPost] = useMutation<IDeleteForumPostMutationData>(deleteForumPostMutation);
  const [deleteForumReply] = useMutation<IDeleteForumReplyMutationData>(deleteForumReplyMutation);
  const [forumPostReact] = useMutation<IForumPostReactMutationData>(forumPostReactMutation);
  const [forumReplyReact] = useMutation<IForumReplyReactMutationData>(forumReplyReactMutation);
  const [lockForumPost] = useMutation<ILockForumPostMutationData>(lockForumPostMutation);
  const [stickyForumPost] = useMutation<IStickyForumPostMutationData>(stickyForumPostMutation);
  const [updateForumPost] = useMutation<IUpdateForumPostMutationData>(updateForumPostMutation);
  const [updateForumReply] = useMutation<IUpdateForumReplyMutationData>(updateForumReplyMutation);
  const [uploadMarkdownImage] = useMutation<IUploadMarkdownImageMutationData>(uploadMarkdownImageMutation);
  const memoizedOptions = useMemo(() => assembleEditorOptions(uploadMarkdownImage), [uploadMarkdownImage]);
  const navigate = useNavigate();

  const typeCheck = function (arg: any): arg is IForumPost {
    // this suits our needs for this specific use case
    // don't use this anywhere else unless args.replies is defined
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if(arg && arg.replies) {
      return true;
    }
    return false;
  };

  const emojiTypeCheck = function (arg: any): arg is BaseEmoji {
    // find out if we have a correct emoji
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if(arg && (arg.native || arg.custom)) {
      return true;
    }
    return false;
  };

  const selectEmoji = function (emoji: string): void {
    if(props.isParent) {
      forumPostReact({variables: {postId: props.post.id, emojiId: emoji}}).catch((err: Error) => {
        // GlobalToaster.show({message: err.message, intent: Intent.DANGER});
      });
    } else {
      forumReplyReact({variables: {replyId: props.post.id, emojiId: emoji}}).catch((err: Error) => {
        // GlobalToaster.show({message: err.message, intent: Intent.DANGER});
      });
    }
  };

  const creationDate = props.post.createdAt ? new Date(Number(props.post.createdAt)) : new Date("2020-07-25T15:24:30+00:00");
  const creationDateText = creationDate.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  let canEdit = false;

  if(props.post.owner && data?.currentUser && (props.post.owner.id === data.currentUser.id || permissions.checkFullWritePermission(data?.currentUser, props.planet))) {
    canEdit = true;
  }

  if(props.post.owner && !showAnyways && data?.currentUser && data?.currentUser.blockedUsers && (data?.currentUser.blockedUsers.filter((value) => value.id === props.post.owner?.id).length > 0)) {
    return (
      <div className="px-3 py-2.5 mb-3 border rounded bg-gray-200 w-full border-gray-300 dark:bg-gray-800 dark:border-gray-700 flex">
        <div className="ForumThreadItem-blocked-text">
          This post is from a blocked user. ({props.post.owner.username})
        </div>
        <Button
          className="ml-auto -mt-1 -mb-1 -mr-1.5"
          minimal={true}
          small={true}
          onClick={() => setShowAnyways(true)}
        >Show Anyways</Button>
      </div>
    );
  }

  return (
    <div className="flex mb-3">
      {props.post.owner && <Profile isOpen={showProfile} planet={props.planet} userId={props.post.owner.id} onClose={() => setProfile(false)}/>}
      {props.post.owner && <ReportDialog isOpen={showReport} onClose={() => setReport(false)} objectId={props.post.id} objectType={props.isParent ? reportObjectType.FORUMPOST : reportObjectType.FORUMREPLY} userId={props.post.owner.id}/>}
      <div
        className="rounded-full w-10 h-10 overflow-hidden bg-gray-200 dark:bg-gray-700 cursor-pointer"
        onClick={() => setProfile(true)}
      >
        {props.post.owner?.profilePicture && <img className="w-full h-full" src={fixPFP(props.post.owner.profilePicture)} alt=""/>}
      </div>
      <div className="ml-3 bg-gray-100 w-full rounded overflow-hidden border border-gray-300 dark:bg-gray-900 dark:border-gray-700">
        <div className="px-3 py-2.5 flex border-b border-gray-300 bg-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className={`font-bold cursor-pointer`} onClick={() => setProfile(true)}>
            {props.post.owner?.username}
          </div>
          {props.post.owner && permissions.checkFullWritePermission(props.post.owner, props.planet) && <div className="ml-2">
            <Tooltip
              content="Planet Member"
            >
              <FontAwesomeIcon icon={faUserAstronaut} className="text-yellow-600 dark:text-yellow-400" size="sm"/> 
            </Tooltip>
          </div>}
          {props.post.owner && props.post.owner.admin && <div className="ml-2">
            <Tooltip
              content="Administrator"
            >
              <FontAwesomeIcon icon={faShieldAlt} className="text-green-600 dark:text-green-400" size="sm"/>
            </Tooltip>
          </div>}
          <div className="ml-2 text-gray-600 dark:text-gray-300">
            {creationDateText}
          </div>
          {data?.currentUser && permissions.checkPublicWritePermission(data?.currentUser, props.planet) && <div className="ml-auto inline-flex -mt-1 -mb-1 -mr-1.5">
            <Button
              minimal
              small
              icon={faQuoteLeft}
              className="inline"
              onClick={() => props.addQuote(props.post)}
            />
            {canEdit && <Button
              minimal
              small
              icon={faEdit}
              className="inline" 
              onClick={() => setEditor(true)}
            />}
            <Popover
              popoverTarget={<Button
                minimal
                small
                icon={faSmile}
                className="inline"
                onClick={() => setEmojiPrompt(true)}
              />}
              open={showEmojiPrompt}
              onClose={() => setEmojiPrompt(false)}
              popoverClassName="overflow-hidden pt-0 pb-0 pl-0 pr-0"
            >
              <Picker
                theme="dark"
                skin={1}
                showPreview={false} 
                set="twitter"
                title="Pick an emoji"
                emoji="smile"
                custom={generateEmojiMartEmojis(props.planet.customEmojis, data?.currentUser && data?.currentUser.customEmojis)}
                onSelect={(e) => {
                  if(emojiTypeCheck(e)) {
                    selectEmoji(e.native ?? e.id); 
                    setEmojiPrompt(false);
                  }
                }}
              />
            </Popover>
            <Popover
              open={showMenu}
              onClose={() => setShowMenu(false)}
              popoverTarget={<Button
                minimal
                small
                icon={faEllipsisH}
                className="inline"
                onClick={() => setShowMenu(true)}
              />}
              popoverClassName="pt-1 pb-1 pl-0 pr-0 w-36"
            >
              <MenuItem
                icon={faFlag}
                intent={Intent.DANGER}
                onClick={() => {
                  setReport(true);
                  setShowMenu(false);
                }}
              >Report</MenuItem>
              {canEdit && <MenuItem
                icon={faTrash}
                intent={Intent.DANGER}
                onClick={() => {
                  if(props.isParent) {
                    deleteForumPost({variables: {postId: props.post.id}}).then(() => {
                      Toasts.success("Successfully deleted post.");
                      navigate(`/planet/${props.planet.id}/${props.forumId}`);
                      props.forumRefetch();
                    }).catch((err: Error) => {
                      Toasts.danger(err.message);
                    });
                  } else {
                    deleteForumReply({variables: {replyId: props.post.id}}).then(() => {
                      Toasts.success("Successfully deleted reply.");
                      props.refetch();
                    }).catch((err: Error) => {
                      Toasts.danger(err.message);
                    });
                  }
                  setShowMenu(false);
                }}
              >Delete</MenuItem>}
              {props.isParent && permissions.checkFullWritePermission(data?.currentUser, props.planet) && <MenuItem
                icon={faThumbtack}
                intent={Intent.SUCCESS}
                onClick={() => {
                  stickyForumPost({variables: {postId: props.post.id}}).then(() => {
                    Toasts.success("Successfully stickied post.");
                    props.forumRefetch();
                  }).catch((err: Error) => {
                    Toasts.danger(err.message);
                  });
                  setShowMenu(false);
                }}
              >{props.post.stickied ? "Unsticky" : "Sticky"}</MenuItem>}
              {props.isParent && typeCheck(props.post) && permissions.checkFullWritePermission(data?.currentUser, props.planet) && <MenuItem
                icon={faLock}
                intent={Intent.WARNING}
                onClick={() => {
                  lockForumPost({variables: {postId: props.post.id}}).then(() => {
                    Toasts.success("Successfully locked post.");
                    props.forumRefetch();
                  }).catch((err: Error) => {
                    Toasts.danger(err.message);
                  });
                  setShowMenu(false);
                }}
              >{props.post.locked ? "Unlock" : "Lock"}</MenuItem>}
            </Popover>
          </div>}
        </div>
        <div className="break-words px-3 pt-2 pb-0">
          {showEditor ? <div className="w-full mb-2 mt-1">
            <SimpleMDEEditor onChange={(value) => setTextValue(value)} value={textValue} options={memoizedOptions}/>
            <Button
              icon={faSave}
              onClick={() => {
                if(textValue === "") {
                  Toasts.danger("Your post must have content.");
                  return;
                }
                if(props.isParent) {
                  updateForumPost({variables: {postId: props.post.id, content: textValue}}).then(() => {
                    Toasts.success("Succsessfully updated post.");
                    setEditor(false);
                  }).catch((err: Error) => {
                    Toasts.danger(err.message);
                  });
                } else {
                  updateForumReply({variables: {replyId: props.post.id, content: textValue}}).then(() => {
                    Toasts.success("Succsessfully updated reply.");
                    setEditor(false);
                  }).catch((err: Error) => {
                    Toasts.danger(err.message);
                  });
                }
              }}
              className="-mt-4 block"
            >
              Save
            </Button> 
          </div> : <Markdown longForm planetEmojis={props.planet.customEmojis} userEmojis={props.post.owner?.customEmojis}>{props.post.content ?? ""}</Markdown>}
        </div>
        {props.post.reactions && props.post.reactions.length > 0 && <div className="p-2.5 pt-0 flex space-x-1">
          {props.post.reactions.map((value) => (
            <div
              key={value.emoji}
              className={`rounded flex px-2 py-1 cursor-pointer ${value.reactors.includes(data?.currentUser.id ?? "notanida") ?
                "bg-blue-300 dark:bg-blue-800 hover:bg-blue-400 dark:hover:bg-blue-700 active:bg-blue-200 dark:active:bg-blue-900 transition-all" :
                "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 active:bg-gray-100 dark:active:bg-gray-800 transition-all"}`}
              onClick={() => {
                selectEmoji(value.emoji);
              }}
            >
              <div className="my-auto mr-1.5">
                {value.emoji.startsWith("ceid:") ? 
                  <img className="h-4 w-4" src={(sysData?.sysInfo.paths.emojiURL ?? "") + value.emoji.split(":")[1]} alt={value.emoji}/> : 
                  <Twemoji text={value.emoji} className="h-4 w-4"/>} 
              </div>
              <div>
                {value.reactors.length}
              </div>
            </div>
          ))}
          <Popover
            popoverTarget={<div
              className="rounded flex px-2 py-1 cursor-pointer border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-800 transition-all"
              onClick={() => setBottomEmojiPrompt(true)}
            >
              <div className="my-auto mr-1.5">
                <FontAwesomeIcon icon={faSmile} className="h-4 w-4"/>
              </div>
              <div>
                +
              </div>
            </div>}
            open={showBottomEmojiPrompt}
            onClose={() => setBottomEmojiPrompt(false)}
            popoverClassName="overflow-hidden pt-0 pb-0 pl-0 pr-0"
          >
            <Picker
              theme="dark"
              skin={1}
              showPreview={false} 
              set="twitter"
              title="Pick an emoji"
              emoji="smile"
              custom={generateEmojiMartEmojis(props.planet.customEmojis, data?.currentUser && data?.currentUser.customEmojis)}
              onSelect={(e) => {
                if(emojiTypeCheck(e)) {
                  selectEmoji(e.native ?? e.id); 
                  setBottomEmojiPrompt(false);
                }
              }}
            />
          </Popover>
        </div>}
      </div>
    </div>
  );
}

export default ForumThreadItem;
