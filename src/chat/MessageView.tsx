import { useQuery } from "@apollo/client";
import getChannel, { IGetChannelData } from "../graphql/queries/components/chat/getChannel";
import IUser from "../types/IUser";
import Message from "./Message";
import MessageViewTextbox from "./MessageViewTextbox";
import IMessage from "../types/IMessage";
import { useEffect } from "react";
import onMessageSent from "../graphql/subscriptions/components/onMessageSent";
import onMessageRemoved from "../graphql/subscriptions/components/onMessageRemoved";
import onMessageUpdated from "../graphql/subscriptions/components/onMessageUpdated";
import IPlanet from "../types/IPlanet";
import permissions from "../util/permissions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentAlt } from "@fortawesome/free-solid-svg-icons";

interface IMessageViewProps {
  channelId: string;
  currentUser?: IUser;
  planet?: IPlanet;
}

let hasSubscribed = "";
let unsubscribeFromMessages: () => any = () => null;
let unsubscribeFromRemoved: () => any = () => null;
let unsubscribeFromUpdated: () => any = () => null;

function MessageView(props: IMessageViewProps): JSX.Element {
  const {data, subscribeToMore} = useQuery<IGetChannelData>(getChannel, {variables: {id: props.channelId, count: 50, pinnedCount: 0}});

  useEffect(() => {
    if(hasSubscribed !== props.channelId && data?.channel.messages) {
      if(hasSubscribed !== "") {
        unsubscribeFromMessages();
        unsubscribeFromRemoved();
        unsubscribeFromUpdated();
      }
      hasSubscribed = props.channelId;
      unsubscribeFromMessages = subscribeToMore({
        document: onMessageSent,
        variables: {channelId: props.channelId},
        updateQuery: (prev, {subscriptionData}) => {
          if(!subscriptionData.data) return prev;
          const data = subscriptionData.data as unknown as {messageSent: IMessage};
          const messageWorkaround = prev.channel.messages?.messages ? prev.channel.messages?.messages : [];
          if(!data.messageSent) return prev;
          
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
      unsubscribeFromRemoved = subscribeToMore({
        document: onMessageRemoved,
        variables: {channelId: props.channelId},
        updateQuery: (prev, {subscriptionData}) => {
          if(!subscriptionData.data) return prev;
          const data = subscriptionData.data as unknown as {messageRemoved: IMessage};
          const messageWorkaround = prev.channel.messages?.messages ? prev.channel.messages?.messages : [];
          if(!data.messageRemoved) return prev;
          
          const newMessages = messageWorkaround.filter(m => m.id !== data.messageRemoved.id);
             

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
      unsubscribeFromUpdated = subscribeToMore({
        document: onMessageUpdated,
        variables: {channelId: props.channelId},
        updateQuery: (prev, {subscriptionData}) => { 
          if(!subscriptionData.data) return prev;
          const data = subscriptionData.data as unknown as {messageUpdated: IMessage};
          const messageWorkaround = prev.channel.messages?.messages ? prev.channel.messages?.messages : [];
          if(!data.messageUpdated) return prev;

          const newMessages = messageWorkaround.map(m => m.id === data.messageUpdated.id ? data.messageUpdated : m); 

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



  return (
    <div className="flex h-full max-h-full flex-col flex-shrink overflow-y-auto overflow-x-hidden w-full">
      <div className="flex max-h-full h-full overflow-y-auto flex-col-reverse scrollbar scrollbar-track-white scrollbar-thumb-gray-400 dark:scrollbar-track-gray-900 dark:scrollbar-thumb-gray-600">
        <div className="flex-col-reverse flex mb-3 min-h-full">
          {data?.channel?.messages && data.channel.messages.messages.map((message: IMessage, index) => (
            <Message key={message.id} message={message} currentUser={props.currentUser} planet={props.planet} previousMessage={data.channel.messages?.messages[index + 1]} nextMessage={data.channel.messages?.messages[index - 1]}/>
          ))}
          {data?.channel?.messages && data?.channel?.messages?.messages.length < 50 && <div className="ml-4 mt-auto">
            <FontAwesomeIcon icon={faCommentAlt} className="text-gray-600 dark:text-gray-300 mb-2" size="8x"/>
            <div className="font-extrabold text-3xl">Welcome to #{data.channel.name}!</div>
            <div className="text-document mt-1">This is the beginning of ${data.channel.name}. Say hi!</div>
          </div>}
        </div>
      </div>
      {data?.channel && (props.planet ? (props.currentUser && permissions.checkPublicWritePermission(props.currentUser, props.planet)) : true) && <MessageViewTextbox channel={data.channel}/>}
    </div>
  );
}

export default MessageView;
