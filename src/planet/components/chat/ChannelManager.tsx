import { useMutation } from "@apollo/client";
import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Button from "../../../components/controls/Button";
import Dialog from "../../../components/dialog/Dialog";
import DialogBody from "../../../components/dialog/DialogBody";
import DialogHeader from "../../../components/dialog/DialogHeader";
import Toasts from "../../../components/display/Toasts";
import Textbox from "../../../components/input/Textbox";
import Intent from "../../../components/Intent";
import List from "../../../components/list/List";
import ListItem from "../../../components/list/ListItem";
import Popover from "../../../components/overlays/Popover";
import createChannelMutation, { ICreateChannelMutationData } from "../../../graphql/mutations/components/chats/createChannelMutation";
import deleteChannelMutation, { IDeleteChannelMutationData } from "../../../graphql/mutations/components/chats/deleteChannelMutation";
import renameChannelMutation, { IRenameChannelMutationData } from "../../../graphql/mutations/components/chats/renameChannelMutation";
import IChannel from "../../../types/IChannel";

interface IChannelManagerProps {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
  channels: IChannel[];
  chatId: string;
}

function ChannelManager(props: IChannelManagerProps): JSX.Element {
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [createTextbox, setCreateTextbox] = useState<string>("");
  const [showRename, setShowRename] = useState<string>("");
  const [renameTextbox, setRenameTextbox] = useState<string>("");
  const [showDelete, setShowDelete] = useState<string>("");
  const [createChannelM] = useMutation<ICreateChannelMutationData>(createChannelMutation);
  const [renameChannelM] = useMutation<IRenameChannelMutationData>(renameChannelMutation);
  const [deleteChannelM] = useMutation<IDeleteChannelMutationData>(deleteChannelMutation);

  function createChannel(): void {
    if (createTextbox.length > 0) {
      createChannelM({variables: {chatId: props.chatId, name: createTextbox}}).then(() => {
        Toasts.success("Channel created successfully.");
        props.refetch();
        setCreateTextbox("");
        setShowCreate(false);
      }).catch((e: Error) => {
        Toasts.danger(e.message);
      });
    } else {
      Toasts.danger("Channel name cannot be empty.");
    }
  }

  function renameChannel(id: string): void {
    if (renameTextbox.length > 0) {
      renameChannelM({variables: {channelId: id, name: renameTextbox}}).then(() => {
        Toasts.success("Channel renamed successfully.");
        props.refetch();
        setRenameTextbox("");
        setShowRename("");
      }).catch((e: Error) => {
        Toasts.danger(e.message);
      });
    } else {
      Toasts.danger("Channel name cannot be empty.");
    }
  }

  return (
    <Dialog
      open={props.isOpen}
      onClose={props.onClose}
    >
      <DialogBody>
        <DialogHeader>
          Channel Manager
        </DialogHeader>
        <List
          name={`${props.channels.length} channels`}
          actions={<Popover
            open={showCreate}
            onClose={() => setShowCreate(false)}
            popoverTarget={<Button
              small
              minimal
              icon={faPlus}
              onClick={() => setShowCreate(true)}
            >Create Channel</Button>}
          >
            <Textbox
              placeholder="Channel Name"
              className="mr-2"
              value={createTextbox}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCreateTextbox(e.target.value)}
            />
            <Button
              onClick={createChannel}
            >Create</Button>
          </Popover>}
        >
          {props.channels.map((channel: IChannel) => (
            <ListItem
              key={channel.id}
              actions={<div className="flex">
                <Popover
                  open={showRename === channel.id}
                  onClose={() => setShowRename("")}
                  popoverTarget={<Button
                    small
                    icon={faEdit}
                    className="mr-2"
                    onClick={() => setShowRename(channel.id)}
                  />}
                >
                  <Textbox
                    placeholder="Channel Name"
                    className="mr-2"
                    value={renameTextbox}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRenameTextbox(e.target.value)}
                  />
                  <Button
                    onClick={() => renameChannel(channel.id)}
                  >Rename</Button>
                </Popover>
                <Popover
                  open={showDelete === channel.id}
                  onClose={() => setShowDelete("")}
                  popoverTarget={<Button
                    small
                    intent={Intent.DANGER}
                    icon={faTrash}
                    onClick={() => setShowDelete(channel.id)}
                  />}
                >
                  <Button
                    intent={Intent.DANGER}
                    onClick={() => deleteChannelM({variables: {channelId: channel.id}}).then(() => {
                      Toasts.success("Channel deleted successfully.");
                      props.refetch();
                    }).catch((e: Error) => {
                      Toasts.danger(e.message);
                    })}
                  >Delete</Button>
                </Popover>
              </div>}
            >{channel.name}</ListItem>
          ))}
        </List>
      </DialogBody>
    </Dialog>
  );
}

export default ChannelManager;
