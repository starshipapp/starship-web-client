import { faChartBar } from "@fortawesome/free-solid-svg-icons";
import NonIdealState from "../components/display/NonIdealState";
import Page from "../components/layout/Page";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";

function GAdminHome(): JSX.Element {
  return (
    <Page>
      <PageContainer className="flex flex-col">
        <PageHeader>Statistics</PageHeader>
        <NonIdealState
          icon={faChartBar}
          title="Statistics not available"
        >Statistics are not currently available in this build of Starship.</NonIdealState>
      </PageContainer>
    </Page>
  );
}

export default GAdminHome;
