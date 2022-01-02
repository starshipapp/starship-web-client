import Page from "../components/layout/Page";
import PageContainer from "../components/layout/PageContainer";
import PageSubheader from "../components/layout/PageSubheader";
import PageHeader from "../components/layout/PageHeader";
import Option from "../components/controls/Option";
import { useState } from "react";
import yn from "yn";
import Callout from "../components/text/Callout";
import Intent from "../components/Intent";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

function AppearanceSettings(): JSX.Element {
  const [isDark, setDark] = useState<boolean>(localStorage.getItem("useDarkTheme") ? yn(localStorage.getItem("useDarkTheme")) ?? true : true);
  const [isList, setList] = useState<boolean>(localStorage.getItem("files.listView") ? yn(localStorage.getItem("files.listView")) ?? false : false);
  const [useLatex, setLatex] = useState<string>(localStorage.getItem("useLatex") ?? "html");

  return (
    <Page>
      <PageContainer>
        <PageHeader>Appearance</PageHeader>
        <Callout
          intent={Intent.PRIMARY} 
          icon={faInfoCircle}
          className="mt-5"
        >Appearance settings do not sync across devices.</Callout>
        <PageSubheader>Themes</PageSubheader>
        <Option
          description="Use the dark theme. Some elements may be adjusted to allow for required contrast. (default)"
          checked={isDark}
          onClick={() => {
            setDark(true);
            localStorage.setItem("useDarkTheme", "true");
            document.body.classList.add("dark");
          }}
        >Dark</Option>
        <Option
          description="Use the light theme."
          checked={!isDark}
          onClick={() => {
            setDark(false);
            localStorage.setItem("useDarkTheme", "false");
            document.body.classList.remove("dark");
          }}
        >Light</Option>
        <PageSubheader>Files</PageSubheader>
        <Option
          description="Use the button-based view for files. (default)"
          checked={!isList}
          onClick={() => {
            setList(false);
            localStorage.setItem("files.listView", "false");
          }}
        >Button View</Option>
        <Option
          description="Use the list-based view for files."
          checked={isList}
          onClick={() => {
            setList(true);
            localStorage.setItem("files.listView", "true");
          }}
        >List View</Option>
        <PageSubheader>LaTeX</PageSubheader>
        <Option
          description="Use HTML and MathML. (very slow, good for accessibility and readability)"
          checked={useLatex === "true"}
          onClick={() => {
            setLatex("true");
            localStorage.setItem("useLatex", "true");
          }}
        >HTML & MathML</Option>
        <Option
          description="Use HTML only. (slow, good for readability) (default)"
          checked={useLatex === "html"}
          onClick={() => {
            setLatex("html");
            localStorage.setItem("useLatex", "html");
          }}
        >HTML only</Option>
        <Option
          description="Use MathML only. Some browsers may not support this option. (fast, good for accessibility)"
          checked={useLatex === "mathml"}
          onClick={() => {
            setLatex("mathml");
            localStorage.setItem("useLatex", "mathml");
          }}
        >MathML only</Option>
        <Option
          description="Disable LaTeX completely. This will break all math formatting. (fastest)"
          checked={useLatex === "false"}
          onClick={() => {
            setLatex("false");
            localStorage.setItem("useLatex", "false");
          }}
        >Disable LaTeX</Option>
      </PageContainer>
    </Page>
  );
}

export default AppearanceSettings;
