import { useMutation, useQuery } from "@apollo/client";
import { Alert, Button, ButtonGroup, Icon, Intent, Popover } from "@blueprintjs/core";
import React, { useMemo, useState } from "react";
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
import { useHistory } from "react-router-dom";
import { GlobalToaster } from "../../../util/GlobalToaster";
import "./css/ForumThreadItem.css";
import "emoji-mart/css/emoji-mart.css";
import isMobile from "../../../util/isMobile";
import uploadMarkdownImageMutation, { IUploadMarkdownImageMutationData } from "../../../graphql/mutations/misc/uploadMarkdownImageMutation";
import { assembleEditorOptions } from "../../../util/editorOptions";
import fixPFP from "../../../util/fixPFP";
import Markdown from "../../../util/Markdown";
import generateEmojiMartEmojis from "../../../util/generateEmojiMartEmojis";
import getSysInfo, { IGetSysInfoData } from "../../../graphql/queries/misc/getSysInfo";

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
  const [showAlert, setAlert] = useState<boolean>(false);
  const [showEmojiPrompt, setEmojiPrompt] = useState<boolean>(false);
  const [showProfile, setProfile] = useState<boolean>(false);
  const [showReport, setReport] = useState<boolean>(false);
  const [showAnyways, setShowAnyways] = useState<boolean>(false);
  const [deleteForumPost] = useMutation<IDeleteForumPostMutationData>(deleteForumPostMutation);
  const [deleteForumReply] = useMutation<IDeleteForumReplyMutationData>(deleteForumReplyMutation);
  const [forumPostReact] = useMutation<IForumPostReactMutationData>(forumPostReactMutation);
  const [forumReplyReact] = useMutation<IForumReplyReactMutationData>(forumReplyReactMutation);
  const [lockForumPost] = useMutation<ILockForumPostMutationData>(lockForumPostMutation);
  const [stickyForumPost] = useMutation<IStickyForumPostMutationData>(stickyForumPostMutation);
  const [updateForumPost] = useMutation<IUpdateForumPostMutationData>(updateForumPostMutation);
  const [updateForumReply] = useMutation<IUpdateForumReplyMutationData>(updateForumReplyMutation);
  const history = useHistory();
  const [uploadMarkdownImage] = useMutation<IUploadMarkdownImageMutationData>(uploadMarkdownImageMutation);
  const memoizedOptions = useMemo(() => assembleEditorOptions(uploadMarkdownImage), [uploadMarkdownImage]);

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
        GlobalToaster.show({message: err.message, intent: Intent.DANGER});
      });
    } else {
      forumReplyReact({variables: {replyId: props.post.id, emojiId: emoji}}).catch((err: Error) => {
        GlobalToaster.show({message: err.message, intent: Intent.DANGER});
      });
    }
  };

  const creationDate = props.post.createdAt ? new Date(Number(props.post.createdAt)) : new Date("2020-07-25T15:24:30+00:00");
  const creationDateText = creationDate.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const mobileCreationDateText = creationDate.toLocaleDateString(undefined, { weekday: "short", year: "numeric", month: "short", day: "numeric" });
  let canEdit = false;

  if(props.post.owner && data?.currentUser && (props.post.owner.id === data.currentUser.id || permissions.checkFullWritePermission(data?.currentUser, props.planet))) {
    canEdit = true;
  }

  if(props.post.owner && !showAnyways && data?.currentUser.blockedUsers && (data?.currentUser.blockedUsers.filter((value) => value.id === props.post.owner?.id).length > 0)) {
    return (
      <div className="ForumThreadItem-blocked">
        <div className="ForumThreadItem-blocked-text">
          This post is from a blocked user. ({props.post.owner.username})
        </div>
        <Button
          className="ForumThreadItem-blocked-button"
          text="Show Anyways"
          minimal={true}
          small={true}
          onClick={() => setShowAnyways(true)}
        />
      </div>
    );
  }

  return (
    <div className="ForumThreadItem">
      {props.post.owner && <Profile isOpen={showProfile} planet={props.planet} userId={props.post.owner.id} onClose={() => setProfile(false)}/>}
      {props.post.owner && <ReportDialog isOpen={showReport} onClose={() => setReport(false)} objectId={props.post.id} objectType={props.isParent ? reportObjectType.FORUMPOST : reportObjectType.FORUMREPLY} userId={props.post.owner.id}/>}
      <Alert
        isOpen={showAlert}
        className="bp3-dark"
        icon="trash"
        intent={Intent.DANGER}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        canOutsideClickCancel={true}
        canEscapeKeyCancel={true}
        onCancel={() => setAlert(false)}
        onConfirm={() => {
          if(props.isParent) {
            deleteForumPost({variables: {postId: props.post.id}}).then(() => {
              GlobalToaster.show({message: "Successfully deleted post.", intent: Intent.SUCCESS});
              history.push(`/planet/${props.planet.id}/${props.forumId}`);
              props.forumRefetch();
            }).catch((err: Error) => {
              GlobalToaster.show({message: err.message, intent: Intent.DANGER});
            });
          } else {
            deleteForumReply({variables: {replyId: props.post.id}}).then(() => {
              GlobalToaster.show({message: "Successfully deleted reply.", intent: Intent.SUCCESS});
              props.refetch();
            }).catch((err: Error) => {
              GlobalToaster.show({message: err.message, intent: Intent.DANGER});
            });
          }
        }}
      >Are you sure you want to delete this post? It will be lost forever! (A long time!)</Alert>
      <div className="ForumThreadItem-info">
        <div className="ForumThreadItem-profilepic" onClick={() => setProfile(true)}>
          {props.post.owner && props.post.owner.profilePicture && <img alt="pfp" src={`${fixPFP(props.post.owner.profilePicture)}?t=${Number(Date.now())}`}/>}
        </div>
        <div className="ForumThreadItem-username" onClick={() => setProfile(false)}>{props.post.owner && props.post.owner.username}</div>
        {!isMobile() && props.post.owner && props.post.owner.admin && <div className="ForumThreadItem-admin">Global Admin</div>}
        {!isMobile() && props.post.owner && permissions.checkFullWritePermission(props.post.owner, props.planet) && props.post.owner.admin && <div className="ForumThreadItem-member">Planet Member</div>}
        {isMobile() && <div className="ForumThreadItem-mobile-date">
          <Icon icon="time" className="ForumThreadItem-postinfo-dateicon"/>
          <span className="ForumThreadItem-postinfo-date">{mobileCreationDateText}</span>
        </div>}
      </div>
      <div className="ForumThreadItem-content">
        {!isMobile() && <div className="ForumThreadItem-postinfo">
          <div>
            <Icon icon="time" className="ForumThreadItem-postinfo-dateicon"/>
            <span className="ForumThreadItem-postinfo-date">{creationDateText}</span>
          </div>
        </div>}
        <div className="ForumThreadItem-text">
          {showEditor ? <div className="ForumThreadItem-editor">
            <SimpleMDEEditor onChange={(value) => setTextValue(value)} value={textValue} options={memoizedOptions}/>
            <Button
              icon="saved"
              onClick={() => {
                if(textValue === "") {
                  GlobalToaster.show({message: "Your post must have content.", intent: Intent.DANGER});
                  return;
                }
                if(props.isParent) {
                  updateForumPost({variables: {postId: props.post.id, content: textValue}}).then(() => {
                    GlobalToaster.show({message: "Your post has been updated.", intent: Intent.SUCCESS});
                    setEditor(false);
                  }).catch((err: Error) => {
                    GlobalToaster.show({message: err.message, intent: Intent.DANGER});
                  });
                } else {
                  updateForumReply({variables: {replyId: props.post.id, content: textValue}}).then(() => {
                    GlobalToaster.show({message: "Your reply has been updated.", intent: Intent.SUCCESS});
                    setEditor(false);
                  }).catch((err: Error) => {
                    GlobalToaster.show({message: err.message, intent: Intent.DANGER});
                  });
                }
              }}
              className="PageComponent-edit PageComponent-save-button"
            >
              Save
            </Button>
          </div> : <Markdown planetEmojis={props.planet.customEmojis} userEmojis={props.post.owner?.customEmojis}>{props.post.content ?? ""}</Markdown>}
        </div>
        <div className="ForumThreadItem-bottom">
          <ButtonGroup>
            <Button small={true} icon="flag" text={!isMobile() && "Report"} alignText="left" minimal={true} onClick={() => setReport(true)}/>
            <Button small={true} icon="comment" text={!isMobile() && "Quote"} onClick={() => props.addQuote(props.post)} minimal={true} alignText="left"/>
            {canEdit && <Button small={true} icon="edit" text={!isMobile() && "Edit"} onClick={() => setEditor(true)} minimal={true} alignText="left"/>}
            {canEdit && <Button small={true} icon="trash" text={!isMobile() && "Delete"} minimal={true} onClick={() => setAlert(true)} alignText="left" intent={Intent.DANGER}/>}
            {data?.currentUser && props.isParent && permissions.checkFullWritePermission(data?.currentUser, props.planet) && <Button 
              small={true}
              icon="pin"
              text={!isMobile() && (props.post.stickied ? "Unsticky" : "Sticky")}
              minimal={true}
              onClick={() => {
                stickyForumPost({variables: {postId: props.post.id}}).then(() => {
                  GlobalToaster.show({message: "Sucessfully stickied forum post.", intent: Intent.SUCCESS});
                  props.forumRefetch();
                }).catch((err: Error) => {
                  GlobalToaster.show({message: err.message, intent: Intent.DANGER});
                });
              }}
              alignText="left"
              intent={Intent.SUCCESS}
            />}
            {data?.currentUser && typeCheck(props.post) && permissions.checkFullWritePermission(data?.currentUser, props.planet) && <Button 
              small={true} 
              icon="lock" 
              text={!isMobile() && (props.post.locked ? "Unlock" : "Lock")} 
              minimal={true} 
              onClick={() => {
                lockForumPost({variables: {postId: props.post.id}}).then(() => {
                  GlobalToaster.show({message: "Sucessfully locked forum post.", intent: Intent.SUCCESS});
                }).catch((err: Error) => {
                  GlobalToaster.show({message: err.message, intent: Intent.DANGER});
                });
              }} 
              alignText="left" 
              intent={Intent.WARNING}
            />}
          </ButtonGroup>
          {sysData?.sysInfo && <ButtonGroup className="ForumThreadItem-reactions">
            {props.post.reactions && props.post.reactions.map((value) => (<Button 
              key={value.emoji} 
              onClick={() => selectEmoji(value.emoji)} 
              minimal={(data?.currentUser ? !value.reactors.includes(data?.currentUser.id) : true)}
              small={true} 
              icon={value.emoji.startsWith("ceid:") ? 
                <img className="ForumThreadItem-customemoji" src={(sysData.sysInfo.paths.emojiURL ?? "") + value.emoji.split(":")[1]} alt={value.emoji}/> : 
                <Twemoji text={value.emoji} className="ForumThreadItem-twemoji"/>} 
              text={value.reactors.length}
            />))}
            <Popover isOpen={showEmojiPrompt} onClose={() => setEmojiPrompt(false)}>
              <Button minimal={true} small={true} icon="new-object" onClick={() => setEmojiPrompt(true)}/>
              <div>
                <Picker
                  theme="dark"
                  skin={1}
                  showPreview={false} 
                  set="twitter"
                  title="Pick an emoji"
                  emoji="smile"
                  custom={generateEmojiMartEmojis(props.planet.customEmojis, data?.currentUser.customEmojis)}
                  onSelect={(e) => {
                    if(emojiTypeCheck(e)) {
                      selectEmoji(e.native ?? e.id); 
                      setEmojiPrompt(false);
                    }
                  }}
                />
              </div>
            </Popover>
          </ButtonGroup>}
        </div>
      </div>
    </div>
  );
}

export default ForumThreadItem;