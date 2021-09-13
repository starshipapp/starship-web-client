import { useMutation, useQuery } from "@apollo/client";
import { Button, Classes, Divider, Intent, Menu, MenuDivider, MenuItem, Popover, PopoverInteractionKind } from "@blueprintjs/core";
import { useEffect, useState } from "react";
import MessageView from "../../../chat/MessageView";
import setChannelTopicMutation, { ISetChannelTopicMutationData } from "../../../graphql/mutations/components/chats/setChannelTopicMutation";
import getChat, { IGetChatData } from "../../../graphql/queries/components/chat/getChat";
import getCurrentUser, { IGetCurrentUserData } from "../../../graphql/queries/users/getCurrentUser";
import { GlobalToaster } from "../../../util/GlobalToaster";
import permissions from "../../../util/permissions";
import IComponentProps from "../IComponentProps";
import ChannelManager from "./ChannelManager";
import "./css/ChatComponent.css";

function ChatComponent(props: IComponentProps): JSX.Element {
  const {data: userData} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });
  const {data, refetch} = useQuery<IGetChatData>(getChat, {variables: {id: props.id}});
  const [isOpen, setIsOpen] = useState(false);
  const [currentChannel, setCurrentChannel] = useState<string>("");
  const [showTopicText, setShowTopicText] = useState(false);
  const [topicText, setTopicText] = useState("");
  const [setTopicM] = useMutation<ISetChannelTopicMutationData>(setChannelTopicMutation);

  function setTopic(): void {
    setTopicM({variables: {channelId: currentChannel, topic: topicText}}).then(() => {
      GlobalToaster.show({intent: Intent.SUCCESS, message: "Topic set succesfully."});
      setShowTopicText(false);
    }).catch((e: Error) => {
      GlobalToaster.show({intent: Intent.DANGER, message: e.message});
    });
  }

  useEffect(() => {
    if (data?.chat?.channels && data.chat.channels.length > 0 && currentChannel === "") {
      setCurrentChannel(data.chat.channels[0].id);
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
  }, [data, currentChannel]);

  const currentChannelObject = data?.chat?.channels?.find((channel) => channel.id === currentChannel);

  return (
    <div className="ChatComponent">
      {data?.chat?.channels && <ChannelManager
        isOpen={isOpen}
        chatId={props.id}
        onClose={() => setIsOpen(false)}
        refetch={refetch}
        channels={data?.chat?.channels}
      />}
      <div className="ChatComponent-header">
        <div className="ChatComponent-header-left">
          <Popover minimal={true} interactionKind={PopoverInteractionKind.HOVER}>
            <Button
              minimal={true}
              icon="chat"
              text={currentChannelObject?.name ?? "Add a channel to get started"}
              rightIcon="caret-down"
              className="ChatComponent-channel-switcher"
            />
            <Menu>
              {data?.chat?.channels && data?.chat?.channels.map((channel, index) => (
                <MenuItem 
                  icon={channel.type === 1 ? "video" : "chat"}
                  key={index}
                  text={channel.name}
                  onClick={() => setCurrentChannel(channel.id)}
                />
              ))}
              {userData?.currentUser && permissions.checkFullWritePermission(userData?.currentUser, props.planet) && <MenuDivider/>}
              {userData?.currentUser && permissions.checkFullWritePermission(userData?.currentUser, props.planet) && <MenuItem
                icon="wrench"
                text="Manage Channels"
                onClick={() => setIsOpen(true)}
              />}
            </Menu>
          </Popover>
          <Divider/>
          <div className={`ChatComponent-header-topic${currentChannelObject?.topic ? "" : " ChatComponent-header-topic-unset"}`}>
            {currentChannelObject?.topic ? currentChannelObject.topic : "No topic set"}
          </div>
          {userData?.currentUser && permissions.checkFullWritePermission(userData?.currentUser, props.planet) && currentChannelObject && <Popover
            isOpen={showTopicText}
            onClose={() => setShowTopicText(false)}
            minimal={true}
          >
            <Button
              minimal={true}
              icon="edit"
              onClick={() => {
                setShowTopicText(true);
                setTopicText(currentChannelObject.topic ?? "");
              }}
              className="ChatComponent-header-topic-edit"
            />
            <div className="ChatComponent-header-change-topic">
              <div className="menu-form">
                <input 
                  className={`menu-input ${Classes.INPUT}`}
                  placeholder="Channel Topic" 
                  onKeyDown={(e) => {e.key === "Enter" && setTopic();}} 
                  value={topicText}
                  onChange={(e) => setTopicText(e.target.value)}
                />
                <Button className="menu-button" onClick={setTopic}>Set Topic</Button>
              </div>
            </div>
          </Popover>}
        </div>
        <div className="ChatComponent-header-right">
          <Popover>
            <Button minimal={true} icon="pin"/>
          </Popover>
        </div>
      </div>
      <MessageView/>
    </div>
  );
}

export default ChatComponent;
