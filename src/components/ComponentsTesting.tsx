import Intent from "./Intent";
import Textbox from "./input/Textbox";
import Label from "./text/Label";
import { faIcons } from "@fortawesome/free-solid-svg-icons";
import Button from "./controls/Button";
import Checkbox from "./controls/Checkbox";
import { useState } from "react";
import Callout from "./text/Callout";

function ComponentsTesting(): JSX.Element {
  const [dark, setDark] = useState(true);

  return (
    <div className={`${dark ? "dark": ""}`}>
      <div className="bg-gray-50 dark:bg-gray-900 w-screen h-screen flex overflow-auto pb-10">
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
        </div>
      </div>
    </div>
  );
}

export default ComponentsTesting;