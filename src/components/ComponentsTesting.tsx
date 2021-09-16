import Intent from "./Intent";
import Textbox from "./input/Textbox";
import Label from "./text/Label";

function ComponentsTesting(): JSX.Element {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 w-screen h-screen flex">
      <div className="h-screen w-3/4 m-auto">
        <h1 className="text-5xl font-extrabold mt-6 text-black dark:text-white">Components Testing</h1>
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
      </div>
    </div>
  );
}

export default ComponentsTesting;