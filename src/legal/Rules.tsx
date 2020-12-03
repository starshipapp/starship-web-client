import React from "react";
import "./legal.css";

function Rules(): JSX.Element {
  return (
    <div className="legal bp3-dark">
      <div className="legal-header">
        <div className="legal-header-text">
          Rules
        </div>
      </div>
      <div className="legal-container">
        <ul>
          <li>Don't harrass people.</li>
          <li>Don't upload content you don't have the rights to.</li>
          <li>Don't use derogatory language.</li>
          <li>Don't upload NSFW or disturbing content.</li>
          <li>Don't evade bans. This includes making alts to evade bans.</li>
          <li>Don't upload harmful content, including viruses and other malware.</li> 
        </ul>
      </div>
    </div>
  );
}

export default Rules;