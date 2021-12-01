import { memo, useMemo, useState } from "react";
import Profile from "../profile/Profile";
import IMessage from "../types/IMessage";
import IPlanet from "../types/IPlanet";
import IUser from "../types/IUser";
import TextareaAutosize from "react-textarea-autosize";
import Markdown from "../util/Markdown";
import "./css/Message.css";
import { useMutation } from "@apollo/client";
import editMessageMutation, { IEditMessageMutationData } from "../graphql/mutations/components/chats/editMessageMutation";
import permissions from "../util/permissions";
import Toasts from "../components/display/Toasts";
import Button from "../components/controls/Button";
import { faEdit, faFlag, faReply, faSmile, faThumbtack, faTrash } from "@fortawesome/free-solid-svg-icons";

interface IMessageProps {
  message: IMessage;
  planet?: IPlanet;
  currentUser?: IUser;
  previousMessage?: IMessage;
  nextMessage?: IMessage;
}

function Message(props: IMessageProps): JSX.Element {
  const creationDate: Date = useMemo(() => (props.message.createdAt ? new Date(Number(props.message.createdAt)) : new Date("2021-09-14T21:01:30+00:00")), [props.message.createdAt]);
  const creationDateText: string = useMemo(() => creationDate.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" }), [creationDate]);

  const [showProfile, setProfile] = useState<boolean>(false);
  const [showTextbox, setShowTextbox] = useState<boolean>(false);
  const [editTextbox, setEditTextbox] = useState<string>("");

  const [editMessage] = useMutation<IEditMessageMutationData>(editMessageMutation);

  const lessThanHalfHour = function(date: Date, dateToCheck: Date): boolean {
    const halfHour = 1000 * 60 * 30;
    const halfHourAgo = dateToCheck.getTime() - halfHour;

    return date.getTime() > halfHourAgo;
  };

  const isPrevMessageRelated = useMemo(() => (props.previousMessage && 
    props.previousMessage.owner?.username && props.previousMessage.createdAt && 
    props.message.createdAt && props.previousMessage.owner === props.message.owner && 
    lessThanHalfHour(new Date(Number(props.previousMessage.createdAt)), new Date(Number(props.message.createdAt)))), [
      props.previousMessage,
      props.message.createdAt,
      props.message.owner,
    ]);
  
  console.count(props.message.id);

  return (
    <div className={`Message w-full flex relative px-4 hover:bg-gray-200 dark:hover:bg-gray-800 ${isPrevMessageRelated ? "pl-16 py-0.5" : "mt-1 -mb-1.5 py-2"}`}>
      <Profile
        onClose={() => setProfile(false)}
        isOpen={showProfile}
        userId={props.currentUser?.id ?? ""}
      />
      {!isPrevMessageRelated && <div>
        <div className="rounded-full h-10 w-10 mr-2 bg-gray-300 dark:bg-gray-700 display-block" onClick={() => setProfile(true)}>
          {props.message.owner?.profilePicture && <img src={props.message.owner?.profilePicture} alt="" className="rounded-full h-10 w-10" />}
        </div>
      </div>}
      <div className="w-full">
        {!isPrevMessageRelated && <div className="flex mb-1">
          <div className="mr-1.5 font-bold" onClick={() => setProfile(true)}>
            {props.message.owner?.username}
          </div>
          <div className="text-gray-500 dark:text-gray-400">
            {creationDateText}
          </div>
        </div>}
        <div className="w-full flex flex-col">
          {!showTextbox && <div className="flex">
            <div className="inline-block">
              <Markdown longForm planetEmojis={props.planet?.customEmojis} userEmojis={props.message.owner?.customEmojis}>{props.message.content || ""}</Markdown>
            </div>
            {props.message.edited && <div className="text-gray-400 dark:text-gray-500 inline-block ml-2 mt-auto">(edited)</div>}
          </div>}
          {showTextbox && <div className="w-full">
            <TextareaAutosize
              className={`text-document w-full mr-4 py-2 px-3 rounded-md bg-gray-100 dark:bg-gray-800`}
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
                    Toasts.danger(e.message);
                  });
                }
              }}
            />
          </div>}
        </div>
        <div className="Message-buttons hidden bg-gray-200 dark:bg-gray-800 border border-gray-400 dark:border-gray-600 absolute right-4 -top-3 rounded z-10 shadow">
          {(!props.planet || (props.currentUser && permissions.checkPublicWritePermission(props.currentUser, props.planet))) && <Button
            icon={faReply}
            small={true}
            minimal={true}
          />}
          {(!props.planet || (props.currentUser && permissions.checkPublicWritePermission(props.currentUser, props.planet))) && <Button
            icon={faSmile}
            small={true}
            minimal={true}
          />}
          {props.currentUser && (props.message.owner?.id === props.currentUser.id || (props.planet && permissions.checkFullWritePermission(props.currentUser, props.planet))) && <Button
            icon={faEdit}
            small={true}
            minimal={true}
            onClick={() => {
              setEditTextbox(props.message.content ?? "");
              setShowTextbox(true);
            }}
          />}
          {props.currentUser && (props.message.owner?.id === props.currentUser.id || (props.planet && permissions.checkFullWritePermission(props.currentUser, props.planet))) && <Button
            icon={faTrash}
            small={true}
            minimal={true}
          />}
          {props.currentUser && <Button
            icon={faFlag}
            small={true}
            minimal={true}
          />}
          {(!props.planet || (props.currentUser && permissions.checkFullWritePermission(props.currentUser, props.planet))) && <Button
            icon={faThumbtack}
            small={true}
            minimal={true}
          />}
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
