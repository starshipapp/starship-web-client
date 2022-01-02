/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import yn from "yn";

function Unsupported(): JSX.Element {

  let isUnsupported = false;
  const show = localStorage.getItem("debug.showUnsupported") ? yn(localStorage.getItem("debug.showUnsupported")) ?? true : true;
  if(window && window.navigator) {
    const navigator = window.navigator;
    // Detect Brave as an unsupported browser due to poor adblock implementation and
    // unexpected behavior due to fingerprint mitigation. Brave also seems to cause
    // some websockets to unexpectedly fail to connect.
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    if(navigator.brave && (navigator.brave.isBrave() || false)) {
      isUnsupported = true;
    }

    // Detect Internet Explorer as an unsupported browser for what I hope are ovbious
    // reasons
    // @ts-expect-error
    if (window.document.documentMode) {
      isUnsupported = true;
    }
  }
  

  if(isUnsupported && show) {
    return (
      <div className="fixed top-0 bg-red-400 bg-opacity-50 text-black dark:text-white w-full p-2 text-center font-bold pointer-events-none">
        Your browser is unsupported. This may result in unexpected behavior. We recommend using the latest version
        of <a className="font-extrabold" href="https://www.mozilla.org/en-US/firefox/">Firefox</a> or <a className="Unsupported-link" href="https://www.google.com/chrome/">Chrome</a>.
      </div>
    );
  }

  return (<></>);
}

export default Unsupported;
