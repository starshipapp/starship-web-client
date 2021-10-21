/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/ban-ts-comment */

function Unsupported(): JSX.Element {
  let isUnsupported = false;
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
  

  if(isUnsupported) {
    return (
      <div className="Unsupported">
        Your browser is unsupported. This may result in unexpected behavior. We recommend using the latest version
        of <a className="Unsupported-link" href="https://www.mozilla.org/en-US/firefox/">Firefox</a> or <a className="Unsupported-link" href="https://www.google.com/chrome/">Chrome</a>.
      </div>
    );
  }

  return (<></>);
}

export default Unsupported;
