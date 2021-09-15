import { useQuery } from "@apollo/client";
import getChannel, { IGetChannelData } from "../graphql/queries/components/chat/getChannel";
import IUser from "../types/IUser";
import Message from "./Message";
import MessageViewTextbox from "./MessageViewTextbox";
import "./css/MessageView.css";
import IMessage from "../types/IMessage";
import { useEffect } from "react";
import onMessageSent from "../graphql/subscriptions/components/onMessageSent";
import IPlanet from "../types/IPlanet";
import { NonIdealState } from "@blueprintjs/core";
import permissions from "../util/permissions";

interface IMessageViewProps {
  channelId: string;
  currentUser?: IUser;
  planet?: IPlanet;
}

let hasSubscribed = "";
let unsubscribe: () => any = () => null;

function MessageView(props: IMessageViewProps): JSX.Element {
  const {data, subscribeToMore} = useQuery<IGetChannelData>(getChannel, {variables: {id: props.channelId, count: 50, pinnedCount: 0}});

  useEffect(() => {
    if(hasSubscribed !== props.channelId && data?.channel.messages) {
      if(hasSubscribed !== "") {
        unsubscribe();
      }
      hasSubscribed = props.channelId;
      unsubscribe = subscribeToMore({
        document: onMessageSent,
        variables: {channelId: props.channelId},
        updateQuery: (prev, {subscriptionData}) => {
          console.log("af");
          if(!subscriptionData.data) return prev;
          const data = subscriptionData.data as unknown as {messageSent: IMessage};
          const messageWorkaround = prev.channel.messages?.messages ? prev.channel.messages?.messages : [];
          if(!data.messageSent) return prev;
          console.log(data.messageSent);
          
          const newMessages = [data.messageSent, ...messageWorkaround];

          if(newMessages.length > 50) {
            newMessages.unshift();
          }

          return Object.assign({}, prev, {
            channel: {
              ...prev.channel,
              messages: {
                cursor: prev.channel.messages?.cursor ?? "0",
                messages: newMessages
              }
            }
          });
        }
      });
    }
  }, [data, subscribeToMore, props.channelId]);

  console.log("bruh");

  return (
    <div className="MessageView">
      <div className="MessageView-message-container">
        <div className="MessageView-messages">
          {data?.channel?.messages && data.channel.messages.messages.map((message: IMessage, index) => (
            <Message key={message.id} message={message} currentUser={props.currentUser} planet={props.planet} previousMessage={data.channel.messages?.messages[index + 1]} nextMessage={data.channel.messages?.messages[index - 1]}/>
          ))}
          {data?.channel?.messages && data?.channel?.messages?.messages.length < 50 && <NonIdealState
            icon="chat"
            title={`Welcome to #${data.channel.name ?? "unknown_channel"}!`}
            description={`This is the beginning of #${data.channel.name ?? "unknown_channel"}. Say hi!`}
            className="MessageView-intro"
          />}
        </div>
      </div>
      {data?.channel && (props.planet ? (props.currentUser && permissions.checkPublicWritePermission(props.currentUser, props.planet)) : true) && <MessageViewTextbox channel={data.channel}/>}
    </div>
  );
}

export default MessageView;