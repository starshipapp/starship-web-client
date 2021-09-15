import { useMutation } from "@apollo/client";
import { Classes, Intent } from "@blueprintjs/core";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import sendMessageMutation, { ISendMessageMutationData } from "../graphql/mutations/components/chats/sendMessageMutation";
import IChannel from "../types/IChannel";
import { GlobalToaster } from "../util/GlobalToaster";
import "./css/MessageViewTextbox.css";

interface IMessageViewTextboxProps {
  channel: IChannel;
}

function MessageViewTextbox(props: IMessageViewTextboxProps): JSX.Element {
  const [sendMessage] = useMutation<ISendMessageMutationData>(sendMessageMutation);
  const [message, setMessage] = useState<string>("");

  return (
    <div className="MessageViewTextbox">
      <TextareaAutosize 
        className={`${Classes.INPUT} ${Classes.LARGE} MessageViewTextbox-textarea`}
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
              GlobalToaster.show({message: e.message, intent: Intent.DANGER});
            });
          }
        }}
      />
    </div>
  );
}

export default MessageViewTextbox;