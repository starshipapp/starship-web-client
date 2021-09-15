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
import IChannel from "../types/IChannel";

interface IMessageViewProps {
  channelId: string;
  currentUser?: IUser;
}

let hasSubscribed = false;

function MessageView(props: IMessageViewProps): JSX.Element {
  const {data, subscribeToMore} = useQuery<IGetChannelData>(getChannel, {variables: {id: props.channelId, count: 50, pinnedCount: 0}});

  useEffect(() => {
    if(!hasSubscribed && data?.channel.messages) {
      console.log("subscribing to messages");
      hasSubscribed = true;
      subscribeToMore({
        document: onMessageSent,
        variables: {channelId: props.channelId},
        updateQuery: (prev, {subscriptionData}) => {
          console.log("af");
          if(!subscriptionData.data) return prev;
          const data = subscriptionData.data as unknown as {messageSent: IMessage};
          const messageWorkaround = prev.channel.messages?.messages ? prev.channel.messages?.messages : [];
          if(!data.messageSent) return prev;
          console.log(data.messageSent);
          return Object.assign({}, prev, {
            channel: {
              messages: {
                messages: [...messageWorkaround, data.messageSent]
              }
            }
          });
        }
      });
    }
  }, [data, subscribeToMore, props.channelId]);

  return (
    <div className="MessageView">
      <div className="MessageView-message-container">
        <div className="MessageView-messages">
          {data?.channel?.messages && data.channel.messages.messages.map((message: IMessage) => (
            <Message key={message.id} message={message} currentUser={props.currentUser} />
          ))}
        </div>
      </div>
      {data?.channel && <MessageViewTextbox channel={data.channel}/>}
    </div>
  );
}

export default MessageView;