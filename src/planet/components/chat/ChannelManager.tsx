import { useMutation } from "@apollo/client";
import { Button, ButtonGroup, Classes, Dialog, Intent, Popover } from "@blueprintjs/core";
import { useState } from "react";
import createChannelMutation, { ICreateChannelMutationData } from "../../../graphql/mutations/components/chats/createChannelMutation";
import deleteChannelMutation, { IDeleteChannelMutationData } from "../../../graphql/mutations/components/chats/deleteChannelMutation";
import renameChannelMutation, { IRenameChannelMutationData } from "../../../graphql/mutations/components/chats/renameChannelMutation";
import IChannel from "../../../types/IChannel";
import { GlobalToaster } from "../../../util/GlobalToaster";
import "./css/ChannelManager.css";

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
        GlobalToaster.show({intent: Intent.SUCCESS, message: "Channel created successfully."});
        props.refetch();
        setCreateTextbox("");
        setShowCreate(false);
      }).catch((e: Error) => {
        GlobalToaster.show({intent: Intent.DANGER, message: e.message});
      });
    } else {
      GlobalToaster.show({intent: Intent.DANGER, message: "Channel name cannot be empty."});
    }
  }

  function renameChannel(id: string): void {
    if (renameTextbox.length > 0) {
      renameChannelM({variables: {channelId: id, name: renameTextbox}}).then(() => {
        GlobalToaster.show({intent: Intent.SUCCESS, message: "Channel renamed successfully."});
        props.refetch();
        setRenameTextbox("");
        setShowRename("");
      }).catch((e: Error) => {
        GlobalToaster.show({intent: Intent.DANGER, message: e.message});
      });
    } else {
      GlobalToaster.show({intent: Intent.DANGER, message: "Channel name cannot be empty."});
    }
  }

  return (
    <Dialog
      isOpen={props.isOpen}
      onClose={props.onClose}
      title="Channels"
      icon="wrench"
      canOutsideClickClose={true}
      canEscapeKeyClose={true}
      className={Classes.DARK}
    >
      <div className={Classes.DIALOG_BODY}>
        <Popover
          isOpen={showCreate}
          onClose={() => setShowCreate(false)}
          canEscapeKeyClose={true}
        >
          <Button
            text="Add Channel"
            icon="add"
            minimal={true}
            onClick={() => setShowCreate(true)}
            className="ChannelManager-button"
          />
          <div className="ChannelManager-add-channel">
            <div className="menu-form">
              <input ChatComponent-header-topic$
                className={`menu-input ${Classes.INPUT}`}
                placeholder="Channel Name" 
                onKeyDown={(e) => {e.key === "Enter" && createChannel();}} 
                value={createTextbox} onChange={(e) => setCreateTextbox(e.target.value)}
              />
              <Button className="menu-button" onClick={createChannel}>Create Channel</Button>
            </div>
          </div>
        </Popover>
        {props.channels.map(channel => (
          <div key={channel.id} className="ChannelManager-channel">
            <div className="ChannelManager-channel-top">
              <div className="ChannelManager-channel-name">{channel.name}</div>
              <ButtonGroup minimal={true}>
                <Popover
                  isOpen={showRename === channel.id}
                  onClose={() => setShowRename("")}
                  canEscapeKeyClose={true}
                >
                  <Button
                    icon="edit"
                    text="Rename"
                    onClick={() => {
                      setShowRename(channel.id);
                    }}
                    small={true}
                  />
                  <div className="ChannelManager-rename-channel">
                    <div className="menu-form">
                      <input
                        className={`menu-input ${Classes.INPUT}`}
                        placeholder="Channel Name"
                        onKeyDown={(e) => {e.key === "Enter" && renameChannel(channel.id);}}
                        value={renameTextbox} onChange={(e) => setRenameTextbox(e.target.value)}
                      />
                      <Button className="menu-button" onClick={() => renameChannel(channel.id)}>Rename Channel</Button>
                    </div>
                  </div>
                </Popover>
                <Popover
                  isOpen={showDelete === channel.id}
                  onClose={() => setShowDelete("")}
                  canEscapeKeyClose={true}
                >
                  <Button
                    icon="trash"
                    text="Delete"
                    onClick={() => {
                      setShowDelete(channel.id);
                    }}
                    small={true}
                  />
                  <div className="ChannelManager-delete-channel">
                    <p>Are you sure?</p>
                    <Button
                      icon="trash"
                      text="Delete"
                      intent={Intent.DANGER}
                      onClick={() => {
                        deleteChannelM({variables: {channelId: channel.id}}).then(() => {
                          GlobalToaster.show({intent: Intent.SUCCESS, message: "Channel deleted successfully."});
                          props.refetch();
                          setShowDelete("");
                        }).catch((e: Error) => {
                          GlobalToaster.show({intent: Intent.DANGER, message: e.message});
                        });
                      }}
                    />
                  </div>
                </Popover>
              </ButtonGroup>
            </div>
          </div>
        ))}
      </div>
    </Dialog>
  );
}

export default ChannelManager;