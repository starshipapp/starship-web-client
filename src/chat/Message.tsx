import { Button, ButtonGroup, Classes, Intent } from "@blueprintjs/core";
import { memo, useState } from "react";
import Profile from "../profile/Profile";
import IMessage from "../types/IMessage";
import IPlanet from "../types/IPlanet";
import IUser from "../types/IUser";
import TextareaAutosize from "react-textarea-autosize";
import Markdown from "../util/Markdown";
import "./css/Message.css";
import { useMutation } from "@apollo/client";
import editMessageMutation, { IEditMessageMutationData } from "../graphql/mutations/components/chats/editMessageMutation";
import { GlobalToaster } from "../util/GlobalToaster";
import permissions from "../util/permissions";

interface IMessageProps {
  message: IMessage;
  planet?: IPlanet;
  currentUser?: IUser;
  previousMessage?: IMessage;
  nextMessage?: IMessage;
}

function Message(props: IMessageProps): JSX.Element {
  const creationDate: Date = props.message.createdAt ? new Date(Number(props.message.createdAt)) : new Date("2021-09-14T21:01:30+00:00");
  const creationDateText: string = creationDate.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" });

  const [showProfile, setProfile] = useState<boolean>(false);
  const [showTextbox, setShowTextbox] = useState<boolean>(false);
  const [editTextbox, setEditTextbox] = useState<string>("");

  const [editMessage] = useMutation<IEditMessageMutationData>(editMessageMutation);

  const lessThanHalfHour = function(date: Date, dateToCheck: Date): boolean {
    console.log(date);
    console.log(dateToCheck);
    const halfHour = 1000 * 60 * 30;
    const halfHourAgo = dateToCheck.getTime() - halfHour;

    return date.getTime() > halfHourAgo;
  };

  const isPrevMessageRelated = props.previousMessage && 
    props.previousMessage.owner?.username && props.previousMessage.createdAt && 
    props.message.createdAt && props.previousMessage.owner === props.message.owner && 
    lessThanHalfHour(new Date(Number(props.previousMessage.createdAt)), new Date(Number(props.message.createdAt)));

  const isNextMessageRelated = !isPrevMessageRelated && props.nextMessage && 
    props.nextMessage.owner?.username && props.nextMessage.createdAt && 
    props.message.createdAt && props.nextMessage.owner === props.message.owner && 
    lessThanHalfHour(new Date(Number(props.nextMessage.createdAt)), new Date(Number(props.message.createdAt)));

  return (
    <div className={`Message ${isPrevMessageRelated ? "Message-combined" : ""} ${isNextMessageRelated ? "Message-parent": ""}`}>
      <Profile
        onClose={() => setProfile(false)}
        isOpen={showProfile}
        userId={props.currentUser?.id ?? ""}
      />
      {!isPrevMessageRelated && <div className="Message-left">
        <div className="Message-pfp" onClick={() => setProfile(true)}>
          {props.message.owner?.profilePicture && <img src={props.message.owner?.profilePicture} alt="" className="Message-pfp" />}
        </div>
      </div>}
      <div className="Message-right">
        {!isPrevMessageRelated && <div className="Message-header">
          <div className="Message-header-username" onClick={() => setProfile(true)}>
            {props.message.owner?.username}
          </div>
          <div className="Message-header-date">
            {creationDateText}
          </div>
        </div>}
        <div className="Message-body">
          {!showTextbox && <div className="Message-body-text">
            <div className="Message-markdown-wrapper">
              <Markdown planetEmojis={props.planet?.customEmojis} userEmojis={props.message.owner?.customEmojis}>{props.message.content || ""}</Markdown>
            </div>
            {props.message.edited && <div className="Message-body-edited">(edited)</div>}
          </div>}
          {showTextbox && <div className="Message-body-edit">
          <TextareaAutosize
            className={`${Classes.INPUT} Message-edit-textarea`}
            placeholder="Type a message..."
            maxRows={4}
            value={editTextbox}
            onChange={(e) => {
              setEditTextbox(e.target.value);
            }}
            onKeyDown={(e) => {
              if(!editTextbox.replace(/\s/g, '').length) {
                // TODO: delete
                return;
              }
              if (e.key === "Escape") {
                e.preventDefault();
                setShowTextbox(false);
              }
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                editMessage({variables: {messageId: props.message.id, content: editTextbox}}).then(() => {
                  setShowTextbox(false);
                }).catch((e: Error) => {
                  GlobalToaster.show({message: e.message, intent: Intent.DANGER});
                });
              }
            }}
          />
          </div>}
        </div>
        <div className="Message-buttons">
          <ButtonGroup>
            {(!props.planet || (props.currentUser && permissions.checkPublicWritePermission(props.currentUser, props.planet))) && <Button
              icon="arrow-right"
              small={true}
            />}
            {(!props.planet || (props.currentUser && permissions.checkPublicWritePermission(props.currentUser, props.planet))) && <Button
              icon="emoji"
              small={true}
            />}
            {props.currentUser && (props.message.owner?.id === props.currentUser.id || (props.planet && permissions.checkFullWritePermission(props.currentUser, props.planet))) && <Button
              icon="edit"
              small={true}
              onClick={() => {
                setEditTextbox(props.message.content ?? "");
                setShowTextbox(true);
              }}
            />}
            {props.currentUser && (props.message.owner?.id === props.currentUser.id || (props.planet && permissions.checkFullWritePermission(props.currentUser, props.planet))) && <Button
              icon="trash"
              small={true}
            />}
            {props.currentUser && <Button
              icon="flag"
              small={true}
            />}
            {(!props.planet || (props.currentUser && permissions.checkFullWritePermission(props.currentUser, props.planet))) && <Button
              icon="pin"
              small={true}
            />}
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
}

export default memo(Message, (prev, next) => {
  if(prev.message.content !== next.message.content) {
    return false;
  }
  if(prev.message.reactions !== next.message.reactions) {
    return false;
  }
  if(prev.message.owner?.profilePicture !== next.message.owner?.profilePicture) {
    return false;
  }
  if(prev.message.pinned !== next.message.pinned) {
    return false;
  }
  if(prev.currentUser?.id !== next.currentUser?.id) {
    return false;
  }
  if(prev.planet?.members !== next.planet?.members) {
    return false;
  }
  return true;
});