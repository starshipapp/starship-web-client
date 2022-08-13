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
  const [editorType, setEditorType] = useState<string>(localStorage.getItem("editor.type") ?? "toolbar");

  const useExpEditor = yn(localStorage.getItem("debug.editorExperiments"));

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

        {useExpEditor && <div>
          <PageSubheader>Editor</PageSubheader>
          <Option
            description="Use the toolbar-based editor, similar to most office software. (default)"
            checked={editorType === "toolbar"}
            onClick={() => {
              setEditorType("toolbar");
              localStorage.setItem("editor.type", "toolbar");
            }}
          >Toolbar</Option>
          <Option
            description="Use the inline editor, similar to some note taking apps, like Notion."
            checked={editorType === "inline"}
            onClick={() => {
              setEditorType("inline");
              localStorage.setItem("editor.type", "inline");
            }}
          >Inline</Option>
          <Option
            description="Use a plain text editor (with syntax highlighting). This allows you to have the most control over the formatting of your text."
            checked={editorType === "plain"}
            onClick={() => {
              setEditorType("plain");
              localStorage.setItem("editor.type", "plain");
            }}
          >Plain Text</Option>
          <Option
            description="Use a plain text editor, with Vim-like keybindings. If you don't know what the last part of that sentence means, you probably don't want this."
            checked={editorType === "modal"}
            onClick={() => {
              setEditorType("modal");
              localStorage.setItem("editor.type", "modal");
            }}
          >Modal</Option>
        </div>}
      </PageContainer>
    </Page>
  );
}

export default AppearanceSettings;
