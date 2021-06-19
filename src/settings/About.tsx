import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import getSysInfo, { IGetSysInfoData } from "../graphql/queries/misc/getSysInfo";
import "./css/About.css";
import logo from "../assets/images/logo.svg";
import { Button, Code, Collapse } from "@blueprintjs/core";
import { Link } from "react-router-dom";

function About(): JSX.Element {
  const {data: sysData} = useQuery<IGetSysInfoData>(getSysInfo);
  const [isOpen, setOpen] = useState<boolean>(false);
  const envKeys = Object.keys(process.env);
  const envValues = Object.values(process.env);

  return (
    <div className="Settings bp3-dark">
      <div className="Settings-container">
        <div className="Settings-page-header">
          <img className="About-logo" src={logo} alt="Starship logo"/>
        </div>
        <div className="About">
          <div className="About-version-client">
            <div>
              Starship 0.9
            </div>
            <Button
              className="About-debug-button"
              text={`${isOpen ? "Hide": "Show"} debug info`}
              minimal={true}
              icon="info-sign"
              onClick={() => setOpen(!isOpen)}
            />
          </div>
          {sysData?.sysInfo && <>
            <div className="About-version-server">
              {sysData.sysInfo.serverName} {sysData.sysInfo.version}, schema {sysData.sysInfo.schemaVersion}
            </div>
          </>}
          <Collapse isOpen={isOpen}>
            <div className="About-debug-info">
              <h1>Server Info</h1>
              <div className="About-debug-entry">
                <h2>Client Flags</h2>
                <Code><span>{sysData?.sysInfo.clientFlags.join(", ")}</span></Code>
              </div>
              <div className="About-debug-entry">
                <h2>Supported Components</h2>
                <Code><span>{sysData?.sysInfo.supportedComponents.join(", ")}</span></Code>
              </div>
              <div className="About-debug-entry">
                <h2>Supported Features</h2>
                <Code><span>{sysData?.sysInfo.supportedFeatures.join(", ")}</span></Code>
              </div>
              <div className="About-debug-entry">
                <h2>Paths</h2>
                <p>Emoji URL: <Code>{sysData?.sysInfo.paths.emojiURL}</Code></p>
                <p>Banner URL: <Code>{sysData?.sysInfo.paths.bannerURL}</Code></p>
                <p>Profile Pictures URL: <Code>{sysData?.sysInfo.paths.pfpURL}</Code></p>
              </div>
              <h1>Client Info</h1>
              <div className="About-debug-entry">
                <h2>Build Environment Variables</h2>
                {envValues.map((value, index) => (<Code className="About-env-variable">{envKeys[index]}={value}</Code>))}
              </div>
            </div>
          </Collapse>
          <div className="Home-footer">
          <span className="Home-footer-copyright">© Starship 2020 - 2021. All rights reserved.</span>
          <span className="Home-footer-links">
            <Link className="Home-footer-link" to="/terms">Terms</Link>
            <Link className="Home-footer-link" to="/privacy">Privacy Policy</Link> 
            <Link className="Home-footer-link" to="/rules">Rules</Link>
          </span>
        </div>
        </div>
      </div>
    </div>
  );
}

export default About;