import React from "react";
import Page from "../components/layout/Page";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import "./legal.css";

function Terms(): JSX.Element {
  return (
    <Page>
      <PageContainer className="text-document">
        <PageHeader>
          Terms of Service
        </PageHeader>
        <p>We aren't lawyers (and we don't have the money to hire one), so we're going to make this easy for you.</p>
        <p>By using Starship, you agree to the following terms:</p>
        <ul>
          <li>You must be 13 years of age or older to use Starship.</li>
          <li>You cannot decompile, alter, or in any modify or exploit Starship.</li>
          <li>We can terminate your access to Starship at any time, without notice.</li>
          <li>We aren't responsible to anything you, or anyone accessing your account, do on Starship.</li>
          <li>Don't post/upload content you don't have the rights to.</li>
          <li>You give us a perpetual licence to any content you post/upload to Starship.</li>
          <li>You must follow the Starship rules.</li>
          <li>We may connect to third party services, which we have no control over. We aren't responsible for anything they do with your data.</li>
          <li>We aren't liable for any damages (financial or otherwise) you incur while using Starship.</li>
          <li>You must follow your local laws.</li>
          <li>You also agree to follow the laws of the United States and the State of Arizona</li>
          <li>You can't sue us.</li>
          <li>We can update these terms at any time, with or without notice.</li>
        </ul>
      </PageContainer>
    </Page>
  );
}

export default Terms;
