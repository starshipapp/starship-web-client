import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import yn from "yn";
import Checkbox from "../components/controls/Checkbox";
import MenuCollapsed from "../components/menu/MenuCollapsed";
import MenuItem from "../components/menu/MenuItem";

let hasAttached = false;
let startReading = false;
let read = "";

function Debug(): JSX.Element {
  const [show, setShow] = useState(false);
  const [showUnsupported, setShowUnsupported] = useState(localStorage.getItem("debug.showUnsupported") ? yn(localStorage.getItem("debug.showUnsupported")) ?? true : true);

  useEffect(() => {
    if(!hasAttached) {
      hasAttached = true;
      document.addEventListener("keypress", (e) => {
        if(e.key === "~") {
          e.preventDefault();
          startReading = true;
        } else if(startReading) {
          read += e.key;
          if(!(read.length === 0 || read === "*" || read === "*d" || read === "*de" || read === "*deb" || read === "*debu" || read === "*debug")) {
            read = "";
            startReading = false;
          } else if(read === "*debug") {
            read = "";
            startReading = false;
            setShow(true);
          }
        }
      });
    }
  });

  const toggleShowUnsupported = () => {
    setShowUnsupported(!showUnsupported);
    localStorage.setItem("debug.showUnsupported", showUnsupported ? "false" : "true");
  };

  if(show) {
    return (
      <div className="absolute top-0 left-0 h-screen w-screen bg-gray-800 bg-opacity-90 z-50 text-white p-6">
        <div className="text-5xl font-extrabold">Debug</div>
        <div className="text-lg italic font-bold mt-1">"The more monkeys you have, the more you can monkey." - Github Copilot</div>

        <div className="w-92 bg-black mt-2 rounded overflow-hidden">
          <MenuCollapsed
            title="Debug Settings"
          >
            <MenuItem
              rightElement={<Checkbox checked={!showUnsupported} onClick={toggleShowUnsupported}/>}
              onClick={toggleShowUnsupported}
            >Disable "Unsupported" banner</MenuItem>
          </MenuCollapsed>
          <MenuCollapsed
            title="Debug Menu"
          >
            <Link className="link-button" to="/"><MenuItem>Go Home</MenuItem></Link>
            <Link className="link-button" to="/debug/landingtest"><MenuItem>Go to Landing</MenuItem></Link>
            <Link className="link-button" to="/debug/components"><MenuItem>Go to Components</MenuItem></Link>
            <MenuItem onClick={() => setShow(false)}>Exit</MenuItem>
          </MenuCollapsed>
        </div>
      </div>
    );
  }

  return (<></>);
}

export default Debug;
