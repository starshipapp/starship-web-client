import { Button, Divider, Menu, MenuDivider, MenuItem, Popover, PopoverInteractionKind } from "@blueprintjs/core";
import MessageView from "../../../chat/MessageView";
import IComponentProps from "../IComponentProps";
import "./css/ChatComponent.css";

function ChatComponent(props: IComponentProps): JSX.Element {
  return (
    <div className="ChatComponent">
      <div className="ChatComponent-header">
        <div className="ChatComponent-header-left">
          <Popover minimal={true} interactionKind={PopoverInteractionKind.HOVER}>
            <Button minimal={true} icon="chat" text="general" rightIcon="caret-down" className="ChatComponent-channel-switcher"/>
            <Menu>
              <MenuItem icon="chat" text="general"/>
              <MenuItem icon="chat" text="shitposting" labelElement={<div className="ChatComponent-unread ChatComponent-mentioned"/>}/>
              <MenuItem icon="chat" text="mod-chat" labelElement={<div className="ChatComponent-unread"/>}/>
              <MenuDivider/>
              <MenuItem icon="plus" text="Create Channel"/>
            </Menu>
          </Popover>
          <Divider/>
          <div className="ChatComponent-header-topic">
            Talk about anything. Shitposting goes in #shitposting.
          </div>
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
