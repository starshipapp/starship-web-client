import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import Intent from "../components/Intent";
import Page from "../components/layout/Page";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import PageSubheader from "../components/layout/PageSubheader";
import Callout from "../components/text/Callout";
import "./legal.css";

function Rules(): JSX.Element {
  return (
    <Page>
      <PageContainer className="text-document">
        <PageHeader>
          Rules
        </PageHeader>
        <p className="font-bold text-lg">We don't generally enjoy policing what you are and aren't allowed to say, but it's a necessary evil. Here are a few guidelines you're expected to follow.</p>
        <PageSubheader>Harassment</PageSubheader>
        <p>Harassment, including (but not limited to) spam, doxxing, and actions that are generally considered as harassment under U.S. law are strictly prohibited on Starship. 
        Whether or not something is considered harassment is very subjective, so all cases are evaluated on a case-by-case basis, and is up to moderator interpretation.</p>
        <p>In addition, racism, sexism, homophobia and transphobia are prohibited. If you disagree with this, stop using Starship.</p>
        <Callout intent={Intent.WARNING} icon={faExclamationTriangle}>Starship's anti-discrimination rules go both ways. We're not looking for people who are different from us, we're looking for people
        who are trying to make someone's lives worse. If you disagree with this, you should also probably stop using Starship.</Callout>

        <PageSubheader>Copyright</PageSubheader>
        <p>You must own the rights to content that you make publically available. Content on a private planet is not generally checked for copyright violations. No, your piracy ring with 100 members doesn't still
        count as a private planet.</p>
        <Callout intent={Intent.WARNING} icon={faExclamationTriangle}>If we get a valid DMCA notice for content in a private planet, we will have to remove it as required by U.S. law.</Callout>

        <PageSubheader>NSFW Content</PageSubheader>
        <p>Starship doesn't currently have the features needed to allow NSFW content. While this is something we'd like to add in the future, it's not exactly the highest thing on our priority list.
        In most cases (unless you do it repeatedly), you probably wont get banned for this.</p>

        <PageSubheader>Malware</PageSubheader>
        <p>Don't upload content that could harm someone's computer or personal information. This includes adware and other potentially unwanted programs/bundleware. If you're found doing this intentionally,
        you will be banned immediately.</p>

        <PageSubheader>Ban Evasion</PageSubheader>
        <p>Using an alternate account in order to bypass a ban will result in that alt being banned.</p>
      </PageContainer>
    </Page>
  );
}

export default Rules;
