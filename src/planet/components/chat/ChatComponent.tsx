import { useMutation, useQuery } from "@apollo/client";
import { faCamera, faCaretDown, faEdit, faHashtag, faThumbtack, faWrench } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MessageView from "../../../chat/MessageView";
import Button from "../../../components/controls/Button";
import Divider from "../../../components/display/Divider";
import Toasts from "../../../components/display/Toasts";
import Textbox from "../../../components/input/Textbox";
import MenuItem from "../../../components/menu/MenuItem";
import Popover from "../../../components/overlays/Popover";
import PopperPlacement from "../../../components/PopperPlacement";
import setChannelTopicMutation, { ISetChannelTopicMutationData } from "../../../graphql/mutations/components/chats/setChannelTopicMutation";
import getChat, { IGetChatData } from "../../../graphql/queries/components/chat/getChat";
import getCurrentUser, { IGetCurrentUserData } from "../../../graphql/queries/users/getCurrentUser";
import permissions from "../../../util/permissions";
import IComponentProps from "../IComponentProps";
import ChannelManager from "./ChannelManager";

function ChatComponent(props: IComponentProps): JSX.Element {
  const {data: userData} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });
  const {data, refetch} = useQuery<IGetChatData>(getChat, {variables: {id: props.id}});
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitchOpen, setIsSwitchOpen] = useState(false);
  const [isPinsOpen, setIsPinsOpen] = useState(false);
  const [showTopicText, setShowTopicText] = useState(false);
  const [topicText, setTopicText] = useState("");
  const [setTopicM] = useMutation<ISetChannelTopicMutationData>(setChannelTopicMutation);
  const navigate = useNavigate();

  function setTopic(): void {
    setTopicM({variables: {channelId: props.subId, topic: topicText}}).then(() => {
      Toasts.success("Topic set successfully.");
      setShowTopicText(false);
    }).catch((e: Error) => {
      Toasts.danger(e.message);
    });
  }

  useEffect(() => {
    if (data?.chat?.channels && data.chat.channels.length > 0 && !props.subId) {
      navigate(`/planet/${props.planet.id}/${props.id}/${data.chat.channels[0].id}`);
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
  }, [data, navigate, props.id, props.planet.id, props.subId]);

  const currentChannelObject = data?.chat?.channels?.find((channel) => channel.id === props.subId);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden text-black dark:text-white bg-gray-50 dark:bg-gray-900">
      {data?.chat?.channels && <ChannelManager
        isOpen={isOpen}
        chatId={props.id}
        onClose={() => setIsOpen(false)}
        refetch={() => void refetch()}
        channels={data?.chat?.channels}
      />}
      <div className="w-full flex p-2 border-b border-gray-300 dark:border-gray-600">
        <div className="mr-auto flex">
          <Popover
            open={isSwitchOpen}
            onClose={() => setIsSwitchOpen(false)}
            placement={PopperPlacement.bottomStart}
            popoverClassName="pl-0 pr-0 pt-1 pb-1"
            popoverTarget={<Button
              minimal
              onClick={() => setIsSwitchOpen(!isSwitchOpen)}
              icon={faHashtag}
              rightIcon={faCaretDown}
            >{currentChannelObject?.name ?? "Add a channel to get started"}</Button>}
          >
            {data?.chat?.channels && data?.chat?.channels.map((channel) => (
              <Link to={`/planet/${props.planet.id}/${props.id}/${channel.id}`} key={channel.id} className="link-button">
                <MenuItem
                  onClick={() => setIsSwitchOpen(false)}
                  icon={channel.type === 1 ? faCamera : faHashtag}
                >{channel.name}</MenuItem>
              </Link>
            ))}
            {userData?.currentUser && permissions.checkFullWritePermission(userData?.currentUser, props.planet) && <Divider/>}
            {userData?.currentUser && permissions.checkFullWritePermission(userData?.currentUser, props.planet) && <MenuItem
              icon={faWrench}
              onClick={() => setIsOpen(true)}
            >Manage Channels</MenuItem>}
          </Popover>
          <Divider/>
          <div className={`mt-1.5 ml-2 ${currentChannelObject?.topic ? "text-black dark:text-white" : "text-gray-600 dark:text-gray-300"}`}>
            {currentChannelObject?.topic ? currentChannelObject.topic : "No topic set"}
          </div>
          {userData?.currentUser && permissions.checkFullWritePermission(userData?.currentUser, props.planet) && currentChannelObject && <Popover
            open={showTopicText}
            onClose={() => setShowTopicText(false)}
            popoverTarget={<Button
              minimal={true}
              icon={faEdit}
              onClick={() => {
                setShowTopicText(true);
                setTopicText(currentChannelObject.topic ?? "");
              }}
            />}
          >
            <div>
              <div>
                <Textbox
                  placeholder="Channel Topic"
                  onKeyDown={(e) => {e.key === "Enter" && setTopic();}}
                  value={topicText}
                  onChange={(e) => setTopicText(e.target.value)}
                  className="mr-2"
                ></Textbox>
                <Button onClick={setTopic}>Set Topic</Button>
              </div>
            </div>
          </Popover>}
        </div>
        <div>
          <Popover
            open={isPinsOpen}
            onClose={() => setIsPinsOpen(false)}
            placement={PopperPlacement.bottomStart}
            popoverTarget={<Button
              minimal
              onClick={() => setIsPinsOpen(!isPinsOpen)}
              icon={faThumbtack}
            />}
          >
          </Popover>
        </div>
      </div>
      {props.subId && <MessageView currentUser={userData?.currentUser} channelId={props.subId} planet={props.planet}/>}
    </div>
  );
}

export default ChatComponent;
