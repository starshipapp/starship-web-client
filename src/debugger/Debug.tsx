import { useEffect, useState } from "react";
import PageHeader from "../components/layout/PageHeader";

let hasAttached = false;
let startReading = false;
let read = "";

function Debug(): JSX.Element {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if(!hasAttached) {
      hasAttached = true;
      document.addEventListener("keypress", (e) => {
        console.log(read);
        console.log(e);
        console.log(startReading);
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

  if(show) {
    return (
      <div className="absolute top-0 left-0 h-screen w-screen bg-gray-800 bg-opacity-90 z-50 text-white p-6">
        <div className="text-5xl font-extrabold">Debug</div>
        <div className="text-lg italic font-bold mt-1">"An infinite number of monkeys typing into GNU emacs would never make a good program."</div>
      </div>
    );
  }

  return (<></>);
}

export default Debug;