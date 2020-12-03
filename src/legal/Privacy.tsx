import React from "react";
import "./legal.css";

function Privacy(): JSX.Element {
  return (
    <div className="legal bp3-dark">
      <div className="legal-header">
        <div className="legal-header-text">
          Privacy Policy
        </div>
      </div>
      <div className="legal-container">
        <ul>
          <li>We store your email and IP address. We use it to identify you. We don't give it away.</li>
          <li>We won't give away your password, either.</li>
          <li>We use cookies (sorry).</li>
          <li>We don't sell your info.</li>
          <li>We may log some stuff, and that may contain information like your username and email.</li>
          <li>Don't use the site in the EU. If you do, and come to us with some GDPR request, too bad. We told you not to use it.</li>
        </ul>
      </div>
    </div>
  );
}

export default Privacy;