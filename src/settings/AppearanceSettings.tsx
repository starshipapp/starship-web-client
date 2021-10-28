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
      </PageContainer>
    </Page>
  );
}

export default AppearanceSettings;
