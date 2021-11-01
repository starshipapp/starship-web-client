import Page from "../components/layout/Page";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";

function Privacy(): JSX.Element {
  return (
    <Page className="text-document">
      <PageContainer>
        <PageHeader>
          Privacy Policy
        </PageHeader>
        <ul>
          <li>We store your email and IP address. We use it to identify you. We don't give it away.</li>
          <li>We won't give away your password, either.</li>
          <li>We use cookies (sorry).</li>
          <li>We don't sell your info.</li>
          <li>We may log some stuff, and that may contain information like your username and email.</li>
          <li>Don't use the site in the EU. If you do, and come to us with some GDPR request, too bad. We told you not to use it.</li>
        </ul>
      </PageContainer>
    </Page>
  );
}

export default Privacy;
