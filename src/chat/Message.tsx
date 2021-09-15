import IMessage from "../types/IMessage";
import IPlanet from "../types/IPlanet";
import IUser from "../types/IUser";
import Markdown from "../util/Markdown";
import "./css/Message.css";

interface IMessageProps {
  message: IMessage;
  planet?: IPlanet;
  currentUser?: IUser;
}

function Message(props: IMessageProps): JSX.Element {
  const creationDate: Date = props.message.createdAt ? new Date(Number(props.message.createdAt)) : new Date("2021-09-14T21:01:30+00:00");
  const creationDateText: string = creationDate.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" });

  return (
    <div className="Message">
      <div className="Message-left">
        <div className="Message-pfp">
          <img src={props.message.owner?.profilePicture} alt="pfp" className="Message-pfp" />
        </div>
      </div>
      <div className="Message-right">
        <div className="Message-header">
        <div className="Message-header-username">
            {props.message.owner?.username}
          </div>
          <div className="Message-header-date">
            {creationDateText}
          </div>
        </div>
        <div className="Message-body">
          <div className="Message-body-text">
            <Markdown planetEmojis={props.planet?.customEmojis} userEmojis={props.message.owner?.customEmojis}>{props.message.content || ""}</Markdown>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default Message;