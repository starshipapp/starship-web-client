import { resetCaches, useMutation } from "@apollo/client";
import { faReply, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import Toasts from "../components/display/Toasts";
import sendMessageMutation, { ISendMessageMutationData } from "../graphql/mutations/components/chats/sendMessageMutation";
import IChannel from "../types/IChannel";
import IMessage from "../types/IMessage";

interface IMessageViewTextboxProps {
  channel: IChannel;
  reply?: IMessage;
  resetReply: () => void;
}

function MessageViewTextbox(props: IMessageViewTextboxProps): JSX.Element {
  const [sendMessage] = useMutation<ISendMessageMutationData>(sendMessageMutation);
  const [message, setMessage] = useState<string>("");

  return (
    <div className="w-full flex text-document bg-gray-500 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-600 flex-col">
      {props.reply &&
        <div className="flex px-4 py-2 border-b border-gray-300 dark:border-gray-600">
          <FontAwesomeIcon icon={faReply} className="text-gray-600 dark:text-gray-300 my-auto mr-3" />
          <div className="h-5 w-5 overflow-hidden bg-gray-300 dark:bg-gray-700 rounded-full flex-shrink-0">
            {props.reply.owner?.profilePicture &&
              <img src={props.reply.owner.profilePicture} alt={props.reply.owner.username} className="h-full w-full object-cover" />
            }
          </div>
          <div className="ml-2 flex flex-shrink overflow-hidden">
            <div className="text-sm leading-5 font-medium text-gray-900 dark:text-gray-300">
              {props.reply.owner?.username}
            </div>
            <div className="ml-2 text-sm leading-5 text-gray-500 dark:text-gray-400 flex-shrink overflow-hidden whitespace-nowrap overflow-ellipsis">
              {props.reply.content}
            </div>
          </div>
          <div className="ml-3 text-gray-600 dark:text-gray-300 my-auto">
            <FontAwesomeIcon icon={faTimes} className="cursor-pointer" onClick={props.resetReply} />
          </div>
        </div>
      }
      <TextareaAutosize 
        className={`flex-grow p-0 bg-transparent border-0 px-4 py-3 resize-none`}
        placeholder="Type a message..."
        maxRows={4}
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        onKeyDown={(e) => {
          if(!message.replace(/\s/g, '').length) {
            return;
          }
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage({variables: {channelId: props.channel.id, content: message, replyTo: props.reply?.id}}).then(() => {
              setMessage("");
              props.resetReply();
            }).catch((e: Error) => {
              Toasts.danger(e.message);
            });
          }
        }}
      />
    </div>
  );
}

export default MessageViewTextbox;
