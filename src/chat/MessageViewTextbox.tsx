import { useMutation } from "@apollo/client";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import Toasts from "../components/display/Toasts";
import sendMessageMutation, { ISendMessageMutationData } from "../graphql/mutations/components/chats/sendMessageMutation";
import IChannel from "../types/IChannel";

interface IMessageViewTextboxProps {
  channel: IChannel;
}

function MessageViewTextbox(props: IMessageViewTextboxProps): JSX.Element {
  const [sendMessage] = useMutation<ISendMessageMutationData>(sendMessageMutation);
  const [message, setMessage] = useState<string>("");

  return (
    <div className="w-full flex">
      <TextareaAutosize 
        className={`text-document w-full m-4 mt-0 py-2 px-3 rounded-md bg-gray-100 dark:bg-gray-800`}
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
            sendMessage({variables: {channelId: props.channel.id, content: message}}).then(() => {
              setMessage("");
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
