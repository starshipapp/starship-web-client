import { Button, ButtonGroup } from "@blueprintjs/core";
import { memo, useState } from "react";
import IMessage from "../types/IMessage";
import IPlanet from "../types/IPlanet";
import IUser from "../types/IUser";
import Markdown from "../util/Markdown";
import "./css/Message.css";

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

  const [showTextbox, setShowTextbox]= useState<boolean>(false);
  const [editTextbox, setEditTextbox] = useState<string>("");

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
      {!isPrevMessageRelated && <div className="Message-left">
        <div className="Message-pfp">
          {props.message.owner?.profilePicture && <img src={props.message.owner?.profilePicture} alt="" className="Message-pfp" />}
        </div>
      </div>}
      <div className="Message-right">
        {!isPrevMessageRelated && <div className="Message-header">
        <div className="Message-header-username">
            {props.message.owner?.username}
          </div>
          <div className="Message-header-date">
            {creationDateText}
          </div>
        </div>}
        <div className="Message-body">
          <div className="Message-body-text">
            <Markdown planetEmojis={props.planet?.customEmojis} userEmojis={props.message.owner?.customEmojis}>{props.message.content || ""}</Markdown>
          </div>
        </div>
        <div className="Message-buttons">
          <ButtonGroup>
            <Button
              icon="arrow-right"
              small={true}
            />
            <Button
              icon="emoji"
              small={true}
            />
            <Button
              icon="edit"
              small={true}
              onClick={() => {
                setEditTextbox(props.message.content ?? "");
                setShowTextbox(true);
              }}
            />
            <Button
              icon="trash"
              small={true}
            />
            <Button
              icon="flag"
              small={true}
            />
            <Button
              icon="pin"
              small={true}
            />
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