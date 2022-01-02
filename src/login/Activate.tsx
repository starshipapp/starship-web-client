import { useMutation } from "@apollo/client";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import Toasts from "../components/display/Toasts";
import Page from "../components/layout/Page";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import PageSubheader from "../components/layout/PageSubheader";
import activateEmailMutation, { IActivateEmailMutationData } from "../graphql/mutations/users/activateEmailMutation";

let activationStarted = false;

function Activate(): JSX.Element {
  const [activateEmail] = useMutation<IActivateEmailMutationData>(activateEmailMutation);
  const { activationdata } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if(!activationStarted) {
      activationStarted = true;
      const activationDataSplit = activationdata ? activationdata.split(":token:") : [];
      if(activationDataSplit.length !== 2) {
        Toasts.danger("Invalid activation data.");
        return;
      }
      activateEmail({variables: {userId: activationDataSplit[0], token: activationDataSplit[1]}}).then(() => {
        navigate("/login");
        Toasts.success("Your account has been activated.");
      }).catch((error: Error) => {
        Toasts.danger(error.message);
      });
    }
  });

  return (
    <Page>
      <PageContainer>
        <PageHeader>
          Activating your account...
        </PageHeader>
        <PageSubheader>
          Please wait while we activate your account.
        </PageSubheader>
        <p>
          If this takes more then a few seconds, please contact us.
        </p>
      </PageContainer>
    </Page>
  );
}

export default Activate;
