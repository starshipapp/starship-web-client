import Intent from "./Intent";
import Textbox from "./input/Textbox";
import Label from "./text/Label";
import { faDotCircle, faIcons } from "@fortawesome/free-solid-svg-icons";
import Button from "./controls/Button";
import Checkbox from "./controls/Checkbox";
import { useState } from "react";
import Callout from "./text/Callout";
import Menu from "./menu/Menu";
import MenuItem from "./menu/MenuItem";
import MenuHeader from "./menu/MenuHeader";
import MenuCollapsed from "./menu/MenuCollapsed";
import Popover from "./overlays/Popover";
import ProgressBar from "./display/ProgressBar";
import NonIdealState from "./display/NonIdealState";
import Tag from "./display/Tag";
import Toasts from "./display/Toasts";

function ComponentsTesting(): JSX.Element {
  const [dark, setDark] = useState(true);
  const [showPopover, setShowPopover] = useState(false);
  return (
    <div className={`${dark ? "dark": ""}`}>
      <div className="bg-gray-50 dark:bg-gray-900 w-screen h-screen flex overflow-auto pb-10 overflow-x-hidden">
        <div className="w-3/4 m-auto pb-6">
          <h1 className="text-5xl font-extrabold mt-6 text-black dark:text-white">Components Testing</h1>
          <div className="mt-4">
            <h2 className="text-3xl font-semibold text-black dark:text-white">Settings</h2>
            <div className="mt-2">
              <Label>Enable dark mode</Label>
              <Checkbox checked={dark} onClick={() => setDark(!dark)}/>
            </div>
          </div>
          <div className="mt-4" id="ComponentsTesting-textbox">
            <h1 className="text-2x1 font-bold mt-3 text-black dark:text-white">Textbox</h1>
            <div className="mt-2">
              <Label>Regular</Label>
              <Textbox className="w-80" placeholder="Text"/>
            </div>
            <div className="mt-3">
              <Label>Large</Label>
              <Textbox className="w-80" placeholder="Text" large={true}/>
            </div>
            <div className="mt-3">
              <Label>Small</Label>
              <Textbox className="w-80" placeholder="Text" small={true}/>
            </div>
            <div className="mt-3">
              <Label>Disabled</Label>
              <Textbox className="w-80" placeholder="Text" disabled={true}/>
            </div>
            <div className="mt-3">
              <Label intent={Intent.DANGER}>Danger</Label>
              <Textbox className="w-80" placeholder="Text" intent={Intent.DANGER}/>
            </div>
            <div className="mt-3">
              <Label intent={Intent.WARNING}>Warning</Label>
              <Textbox className="w-80" placeholder="Text" intent={Intent.WARNING}/>
            </div>
            <div className="mt-3">
              <Label intent={Intent.PRIMARY}>Primary</Label>
              <Textbox className="w-80" placeholder="Text" intent={Intent.PRIMARY}/>
            </div>
            <div className="mt-3">
              <Label intent={Intent.SUCCESS}>Success</Label>
              <Textbox className="w-80" placeholder="Text" intent={Intent.SUCCESS}/>
            </div>
          </div>
          <div className="mt-4" id="ComponentsTesting-label">
            <h1 className="text-2x1 font-bold mt-3 text-black dark:text-white">Label</h1>
            <div className="mt-2">
              <Label>Regular</Label>
            </div>
            <div className="mt-2">
              <Label icon={faIcons}>Icon</Label>
            </div>
            <div className="mt-3">
              <Label intent={Intent.DANGER}>Danger</Label>
            </div>
            <div className="mt-3">
              <Label intent={Intent.WARNING}>Warning</Label>
            </div>
            <div className="mt-3">
              <Label intent={Intent.PRIMARY}>Primary</Label>
            </div>
            <div className="mt-3">
              <Label intent={Intent.SUCCESS}>Success</Label>
            </div>
          </div>
          <div className="mt-4" id="ComponentsTesting-button">
            <h1 className="text-2x1 font-bold mt-3 text-black dark:text-white">Button</h1>
            <div className="mt-2">
              <Label>Regular</Label>
              <Button>Regular</Button>
            </div>
            <div className="mt-3">
              <Label>Icon</Label>
              <Button icon={faIcons}>Icon</Button>
            </div>
            <div className="mt-3">
              <Label>Icon Only</Label>
              <Button icon={faIcons}/>
            </div>
            <div className="mt-3">
              <Label>Large</Label>
              <Button large={true}>Large</Button>
            </div>
            <div className="mt-3">
              <Label>Small</Label>
              <Button small={true}>Small</Button>
            </div>
            <div className="mt-3">
              <Label>Disabled</Label>
              <Button disabled={true}>Disabled</Button>
            </div>
            <div className="mt-3">
              <Label>Minimal</Label>
              <Button minimal={true}>Minimal</Button>
            </div>
            <div className="mt-3">
              <Label intent={Intent.DANGER}>Danger</Label>
              <Button intent={Intent.DANGER}>Danger</Button>
            </div>
            <div className="mt-3">
              <Label intent={Intent.WARNING}>Warning</Label>
              <Button intent={Intent.WARNING}>Warning</Button>
            </div>
            <div className="mt-3">
              <Label intent={Intent.PRIMARY}>Primary</Label>
              <Button intent={Intent.PRIMARY}>Primary</Button>
            </div>
            <div className="mt-3">
              <Label intent={Intent.SUCCESS}>Success</Label>
              <Button intent={Intent.SUCCESS}>Success</Button>
            </div>
          </div>
          <div className="mt-4" id="ComponentsTesting-checkbox">
            <h1 className="text-2x1 font-bold mt-3 text-black dark:text-white">Checkbox</h1>
            <div className="mt-2">
              <Label>Regular</Label>
              <Checkbox/>
            </div>
            <div className="mt-3">
              <Label>Disabled</Label>
              <Checkbox disabled={true}/>
            </div>
            <div className="mt-3">
              <Label intent={Intent.DANGER}>Danger</Label>
              <Checkbox intent={Intent.DANGER}/>
            </div>
            <div className="mt-3">
              <Label intent={Intent.WARNING}>Warning</Label>
              <Checkbox intent={Intent.WARNING}/>
            </div>
            <div className="mt-3">
              <Label intent={Intent.PRIMARY}>Primary</Label>
              <Checkbox intent={Intent.PRIMARY}/>
            </div>
            <div className="mt-3">
              <Label intent={Intent.SUCCESS}>Success</Label>
              <Checkbox intent={Intent.SUCCESS}/>
            </div>
          </div>
          <div className="mt-4" id="ComponentsTesting-callout">
            <h1 className="text-2x1 font-bold mt-3 text-black dark:text-white">Callout</h1>
            <div className="mt-2">
              <Label>Regular</Label>
              <Callout>Regular</Callout>
            </div>
            <div className="mt-3">
              <Label>Icon</Label>
              <Callout icon={faIcons}>Icon</Callout>
            </div>
            <div className="mt-3">
              <Label>Title</Label>
              <Callout title="Title">Regular</Callout>
            </div>
            <div className="mt-3">
              <Label>Title And Icon</Label>
              <Callout title="Title" icon={faIcons}>Regular</Callout>
            </div>
            <div className="mt-3">
              <Label>Danger</Label>
              <Callout title="Danger" icon={faIcons} intent={Intent.DANGER}>Danger</Callout>
            </div>
            <div className="mt-3">
              <Label>Warning</Label>
              <Callout title="Warning" icon={faIcons} intent={Intent.WARNING}>Warning</Callout>
            </div>
            <div className="mt-3">
              <Label>Primary</Label>
              <Callout title="Primary" icon={faIcons} intent={Intent.PRIMARY}>Primary</Callout>
            </div>
            <div className="mt-3">
              <Label>Success</Label>
              <Callout title="Success" icon={faIcons} intent={Intent.SUCCESS}>Success</Callout>
            </div>
          </div>
          <div className="mt-4" id="ComponentsTesting-menu">
            <h1 className="text-2x1 font-bold mt-3 text-black dark:text-white">Menu</h1>
            <div className="mt-2">
              <Menu className="w-56">
                <MenuHeader>Items</MenuHeader>
                <MenuItem>No Icon</MenuItem>
                <MenuItem icon={faIcons}>Icon</MenuItem>
                <MenuItem description="Description">Description</MenuItem>
                <MenuItem icon={faIcons} description="Description">Icon And Description</MenuItem>
                <MenuCollapsed title="Collapsed">
                  <MenuItem icon={faDotCircle}>Collapsed 1</MenuItem>
                  <MenuItem icon={faDotCircle}>Collapsed 2</MenuItem>
                  <MenuItem icon={faDotCircle}>Collapsed 3</MenuItem>
                </MenuCollapsed>
              </Menu>
            </div>
          </div>
          <div className="mt-4" id="ComponentsTesting-popover">
            <h1 className="text-2x1 font-bold mt-3 text-black dark:text-white">Popover</h1>
            <div className="mt-2 w-min">
              <Popover
                popoverTarget={<Button onClick={() => setShowPopover(!showPopover)}>Popover</Button>}
                open={showPopover}
                onClose={() => setShowPopover(false)}
              >
                <div>
                  <Textbox placeholder="Popover" />
                  <Button className="ml-2">Button</Button>
                </div>
              </Popover>
            </div>
          </div>
          <div className="mt-4" id="ComponentsTesting-progress">
            <h1 className="text-2x1 font-bold mt-3 text-black dark:text-white">Progress</h1>
            <div className="mt-2">
              <Label>Regular</Label>
              <ProgressBar progress={0.25} className="w-48"/>
            </div>
            <div className="mt-3">
              <Label>Danger</Label>
              <ProgressBar progress={0.50} intent={Intent.DANGER} className="w-48"/>
            </div>
            <div className="mt-3">
              <Label>Warning</Label>
              <ProgressBar progress={0.75} intent={Intent.WARNING} className="w-48"/>
            </div>
            <div className="mt-3">
              <Label>Primary</Label>
              <ProgressBar progress={1} intent={Intent.PRIMARY} className="w-48"/>
            </div>
            <div className="mt-3">
              <Label>Success</Label>
              <ProgressBar progress={0.25} intent={Intent.SUCCESS} className="w-48"/>
            </div>
          </div>
          <div className="mt-4" id="ComponentsTesting-nonidealstate">
            <h1 className="text-2x1 font-bold mt-3 text-black dark:text-white">Non-ideal State</h1>
            <div className="mt-2">
              <Label>Regular</Label>
              <NonIdealState
                icon={faIcons}
                title="Non-ideal State example"
              >This is an example of the NonIdealState component. This text should wrap at a certain point.</NonIdealState>
            </div>
          </div>
          <div className="mt=4" id="ComponentsTesting-tag">
            <h1 className="text-2x1 font-bold mt-3 text-black dark:text-white">Tag</h1>
            <div className="mt-2">
              <Label>Regular</Label>
              <Tag>Tag</Tag>
            </div>
            <div className="mt-3">
              <Label>Danger</Label>
              <Tag intent={Intent.DANGER}>Tag</Tag>
            </div>
            <div className="mt-3">
              <Label>Warning</Label>
              <Tag intent={Intent.WARNING}>Tag</Tag>
            </div>
            <div className="mt-3">
              <Label>Primary</Label>
              <Tag intent={Intent.PRIMARY}>Tag</Tag>
            </div>
            <div className="mt-3">
              <Label>Success</Label>
              <Tag intent={Intent.SUCCESS}>Tag</Tag>
            </div>
          </div>
          <div className="mt-4" id="ComponentsTesting-toast">
            <h1 className="text-2x1 font-bold mt-3 text-black dark:text-white">Toast</h1>
            <div className="mt-2">
              <Label>Regular</Label>
              <Button onClick={() => Toasts.success("test")}>Show Toast</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComponentsTesting;