import Intent from "./Intent";
import Textbox from "./input/Textbox";
import Label from "./text/Label";
import { faDotCircle, faHome, faIcons } from "@fortawesome/free-solid-svg-icons";
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
import Page from "./layout/Page";
import PageContainer from "./layout/PageContainer";
import PageHeader from "./layout/PageHeader";
import PageSubheader from "./layout/PageSubheader";
import TextArea from "./input/TextArea";
import Option from "./controls/Option";
import List from "./list/List";
import ListItem from "./list/ListItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dialog from "./dialog/Dialog";
import DialogBody from "./dialog/DialogBody";
import DialogHeader from "./dialog/DialogHeader";
import Confirm from "./dialog/Confirm";
import Breadcrumbs from "./display/Breadcrumbs";
import Breadcrumb from "./display/Breadcrumb";
import Tooltip from "./display/Tooltip";
import ContextMenu from "./controls/ContextMenu";
import AlertBody from "./dialog/AlertBody";
import AlertControls from "./dialog/AlertControls";

function ComponentsTesting(): JSX.Element {
  const [dark, setDark] = useState(true);
  const [showPopover, setShowPopover] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  return (
    <div className={`${dark ? "dark": ""}`}>
      <div className="w-screen h-screen flex overflow-x-hidden">
        <Page>
          <PageContainer>
            <PageHeader>Components Testing</PageHeader>
            <div>
              <PageSubheader>Settings</PageSubheader>
              <div>
                <Label>Enable dark mode</Label>
                <Checkbox checked={dark} onClick={() => setDark(!dark)}/>
              </div>
            </div>
            <div id="ComponentsTesting-textbox">
              <PageSubheader>Textbox</PageSubheader>
              <div>
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
            <div id="ComponentsTesting-label">
              <PageSubheader>Label</PageSubheader>
              <div>
                <Label>Regular</Label>
              </div>
              <div>
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
            <div id="ComponentsTesting-button">
              <PageSubheader>Button</PageSubheader>
              <div>
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
            <div id="ComponentsTesting-checkbox">
              <PageSubheader>Checkbox</PageSubheader>
              <div>
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
            <div id="ComponentsTesting-callout">
              <PageSubheader>Callout</PageSubheader>
              <div>
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
            <div id="ComponentsTesting-menu">
              <PageSubheader>Menu</PageSubheader>
              <div>
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
            <div id="ComponentsTesting-popover">
              <PageSubheader>Popover</PageSubheader>
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
            <div id="ComponentsTesting-progress">
              <PageSubheader>Progress</PageSubheader>
              <div>
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
            <div id="ComponentsTesting-nonidealstate">
              <h1 className="text-2x1 font-bold mt-3 text-black dark:text-white">Non-ideal State</h1>
              <div>
                <Label>Regular</Label>
                <NonIdealState
                  icon={faIcons}
                  title="Non-ideal State example"
                >This is an example of the NonIdealState component. This text should wrap at a certain point.</NonIdealState>
              </div>
            </div>
            <div id="ComponentsTesting-tag">
              <PageSubheader>Tag</PageSubheader>
              <div>
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
            <div id="ComponentsTesting-toast">
              <PageSubheader>Toast</PageSubheader>
              <div>
                <Label>Regular</Label>
                <Button onClick={() => Toasts.regular("test" + String(Math.random()))}>Show Toast</Button>
              </div>
              <div className="mt-3">
                <Label>Danger</Label>
                <Button intent={Intent.DANGER} onClick={() => Toasts.danger("test" + String(Math.random()))}>Show Toast</Button>
              </div>
              <div className="mt-3">
                <Label>Warning</Label>
                <Button intent={Intent.WARNING} onClick={() => Toasts.warning("test" + String(Math.random()))}>Show Toast</Button>
              </div>
              <div className="mt-3">
                <Label>Primary</Label>
                <Button intent={Intent.PRIMARY} onClick={() => Toasts.primary("test" + String(Math.random()))}>Show Toast</Button>
              </div>
              <div className="mt-3">
                <Label>Success</Label>
                <Button intent={Intent.SUCCESS} onClick={() => Toasts.success("test" + String(Math.random()))}>Show Toast</Button>
              </div>
            </div>
            <div id="ComponentsTesting-textarea">
              <PageSubheader>Textarea</PageSubheader>
              <div>
                <Label>Regular</Label>
                <TextArea placeholder="Textarea" className="w-full"/>
              </div>
              <div className="mt-3">
                <Label>Large</Label>
                <TextArea placeholder="Textarea" large className="w-full"/>
              </div>
              <div className="mt-3">
                <Label>Small</Label>
                <TextArea placeholder="Textarea" className="w-full" small/>
              </div>
              <div className="mt-3">
                <Label>Disabled</Label>
                <TextArea placeholder="Textarea" className="w-full" disabled/>
              </div>
              <div className="mt-3">
                <Label>Danger</Label>
                <TextArea intent={Intent.DANGER} placeholder="Textarea" className="w-full"/>
              </div>
              <div className="mt-3">
                <Label>Warning</Label>
                <TextArea intent={Intent.WARNING} placeholder="Textarea" className="w-full"/>
              </div>
              <div className="mt-3">
                <Label>Primary</Label>
                <TextArea intent={Intent.PRIMARY} placeholder="Textarea" className="w-full"/>
              </div>
              <div className="mt-3">
                <Label>Success</Label>
                <TextArea intent={Intent.SUCCESS} placeholder="Textarea" className="w-full"/>
              </div>
            </div>
            <div id="ComponentsTesting-options">
              <PageSubheader>Option</PageSubheader>
              <div>
                <Label>Regular</Label>
                <Option>Test Option</Option>
              </div>
              <div>
                <Label>Icon</Label>
                <Option icon={faIcons}>Icon</Option>
              </div>
              <div className="mt-3">
                <Label>Description</Label>
                <Option icon={faIcons} description="Click anywhere to toggle.">Test Option</Option>
              </div>
              <div className="mt-3">
                <Label>Danger</Label>
                <Option icon={faIcons} intent={Intent.DANGER} description="Click anywhere to toggle.">Test Option</Option>
              </div>
              <div className="mt-3">
                <Label>Warning</Label>
                <Option icon={faIcons} intent={Intent.WARNING} description="Click anywhere to toggle.">Test Option</Option>
              </div>
              <div className="mt-3">
                <Label>Primary</Label>
                <Option icon={faIcons} intent={Intent.PRIMARY} description="Click anywhere to toggle.">Test Option</Option>
              </div>
              <div className="mt-3">
                <Label>Success</Label>
                <Option icon={faIcons} intent={Intent.SUCCESS} description="Click anywhere to toggle.">Test Option</Option>
              </div>
            </div>
            <div id="ComponentsTesting-list">
              <PageSubheader>List</PageSubheader>
              <List
                name="Example List"
                actions={<Button small minimal icon={faIcons}>Example Action</Button>}
              >
                <ListItem>
                  Regular
                </ListItem>
                <ListItem
                  icon={<FontAwesomeIcon icon={faIcons}/>}
                >
                  Icon
                </ListItem>
                <ListItem
                  icon={<FontAwesomeIcon icon={faIcons}/>}
                  actions={<Button small icon={faIcons} intent={Intent.DANGER}>Action</Button>}
                >
                  Icon and Actions
                </ListItem>
              </List>
            </div>
            <div id="ComponentsTesting-dialog">
              <PageSubheader>Dialog</PageSubheader>
              <div>
                <Label>Click the button to open the dialog.</Label>
                <Button
                  onClick={() => setShowDialog(true)}
                >Open Dialog</Button>
                <Dialog
                  open={showDialog}
                  onClose={() => setShowDialog(false)}
                >
                  <DialogBody>
                    <DialogHeader>
                      Example Dialog
                    </DialogHeader>
                    <div>
                      This is an example dialog
                    </div>
                  </DialogBody>
                </Dialog>
              </div> 
            </div>
            <div id="ComponentsTesting-confirm">
              <PageSubheader>Confirm</PageSubheader>
              <div>
                <Label>Click the button to open the prompt.</Label>
                <Button
                  onClick={() => setShowConfirm(true)}
                >Open Confirm</Button>
                <Confirm
                  open={showConfirm}
                  onClose={() => setShowConfirm(false)}
                  onConfirm={() => {
                    Toasts.success("Confirmed!");
                    setShowConfirm(false);
                  }}
                  confirmString="Example"
                >
                  You are about to <b>delete</b> this item.
                </Confirm>
              </div>
            </div>
            <div id="ComponentsTesting-breadcrumb">
              <PageSubheader>Breadcrumb</PageSubheader>
              <Breadcrumbs>
                <Breadcrumb icon={faHome}>
                  Home
                </Breadcrumb>
                <Breadcrumb icon={faIcons}>
                  Example
                </Breadcrumb>
                <Breadcrumb active icon={faIcons}>
                  Active
                </Breadcrumb>
              </Breadcrumbs>
            </div> 
            <div id="ComponentsTesting-tooltip">
              <PageSubheader>Tooltip</PageSubheader>
              <div>
                
                <Tooltip content="Example Tooltip" fullWidth>
                  <div className="w-full text-center bg-blue-500 text-white rounded text-2xl font-bold py-10">
                    Hover over me!
                  </div>
                </Tooltip>
              </div>
            </div>
            <div id="ComponentsTesting-contextmenu">
              <PageSubheader>Context Menu</PageSubheader>
              <div>
                <ContextMenu
                  menu={<>
                    <MenuItem icon={faIcons}>
                      Example
                    </MenuItem>
                    <MenuItem intent={Intent.DANGER} icon={faIcons}>
                      Example
                    </MenuItem>
                    <MenuItem intent={Intent.WARNING} icon={faIcons}>
                      Example
                    </MenuItem>
                  </>}
                  fullWidth
                >
                  <div className="w-full text-center bg-blue-500 text-white rounded text-2xl font-bold py-10">
                    Right click me!
                  </div>
                </ContextMenu>
              </div>
            </div> 
            <div id="ComponentsTesting-alert">
              <PageSubheader>Alert</PageSubheader>
              <div>
                <Label>Click the button to open the alert.</Label>
                <Button
                  onClick={() => setShowAlert(true)}
                >Open Alert</Button>
                <Dialog
                  open={showAlert}
                  onClose={() => setShowAlert(false)}
                >
                  <AlertBody icon={faIcons} intent={Intent.DANGER}>
                    Are you sure you want to delete this file? 'Example.txt' will be lost forever! (A long time!)
                  </AlertBody>
                  <AlertControls>
                    <Button className="mr-2">Cancel</Button>
                    <Button intent={Intent.DANGER}>Delete</Button>
                  </AlertControls>
                </Dialog>
              </div>
            </div>
            {/* wow this sure is stupid */}
            <div className="h-10"/>
          </PageContainer>
        </Page>
      </div>
    </div>
  );
}

export default ComponentsTesting;
