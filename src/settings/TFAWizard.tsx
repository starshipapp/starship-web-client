import { useMutation } from "@apollo/client";
import QRCode from "qrcode.react";
import { useEffect, useState } from "react";
import Button from "../components/controls/Button";
import Dialog from "../components/dialog/Dialog";
import DialogBody from "../components/dialog/DialogBody";
import DialogHeader from "../components/dialog/DialogHeader";
import Toasts from "../components/display/Toasts";
import Textbox from "../components/input/Textbox";
import Intent from "../components/Intent";
import confirmTFAMutation, { IConfirmTFAMutation } from "../graphql/mutations/users/confirmTFAMutation";
import generateTOTPSecretMutation, { IGenerateTOTPSecretMutationData } from "../graphql/mutations/users/generateTOTPSecretMutation";

interface ITFAWizardProps {
  onComplete: () => void;
  onClose: () => void;
  isOpen: boolean
}

let hasGeneratedTOTP = false;

function TFAWizard(props: ITFAWizardProps): JSX.Element {
  const [page, setPage] = useState<string>("start");
  const [totpSecret, setSecret] = useState<string>("");
  const [backupCodes, setCodes] = useState<number[]>([]);
  const [codeTextbox, setTextbox] = useState<string>();
  const [generateTOTPSecret] = useMutation<IGenerateTOTPSecretMutationData>(generateTOTPSecretMutation);
  const [confirmTFA] = useMutation<IConfirmTFAMutation>(confirmTFAMutation);
 
  useEffect(() => {
    if(props.isOpen && !hasGeneratedTOTP && totpSecret === "") {
      hasGeneratedTOTP = true;
      generateTOTPSecret().then((data) => {
        if(data.data) {
          setSecret(data.data.generateTOTPSecret);
        }
      }).catch((e: Error) => {
        Toasts.danger(e.message);
        props.onClose();
      });
    }
  });
  
  return (
    <Dialog
      open={props.isOpen}
      onClose={() => {
        setSecret("");
        setPage("start");
        setCodes([]);
        props.onClose();
        if(page === "finished") {
          props.onComplete();
        }

        // Reset the hasGeneratedTOTP flag
        // We don't want to generate a new TOTP secret instantly because
        // that would regenerate the secret.
        setTimeout(() => {
          hasGeneratedTOTP = false;
        }, 200);
      }}
    >
      <DialogBody>
        <DialogHeader>
          Two Factor Authentication
        </DialogHeader>
        {page === "start" && <div>
          {totpSecret !== "" ? <>
            <div className="flex mt-1">
              {/** this div is required on dark mode because some cameras won't pick it up otherwise*/}
              <div className="dark:p-4 dark:bg-gray-50 dark:rounded">
                <QRCode value={totpSecret} size={176}/>
              </div>
              <div className="ml-4 flex flex-col w-full">
                <div className="font-extrabold text-lg -mt-1">Scan this QR code with your authenticator app.</div>
                <div>
                  <span>Don't have one? We recommend </span>
                  <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2">Google Authenticator</a>
                  <span> or </span>
                  <a href="https://play.google.com/store/apps/details?id=org.shadowice.flocke.andotp">andOTP</a>
                  <span>.</span>
                </div>
                <div className="mt-1">
                  <span>If you can't scan the QR code, try using <a href={totpSecret}>this</a> URI.</span>
                </div>
                <div className="mt-1">
                  Click the next button when you're done.
                </div>
                <Button
                  className="mt-auto ml-auto"
                  intent={Intent.PRIMARY}
                  onClick={() => {
                    setPage("check");
                  }}
                >Next</Button>
              </div>
            </div>
          </> : <>Loading...</>}
        </div>}
        {page === "check" && <div className="flex flex-col">
          <div className="font-extrabold text-lg">Enter the code from your authenticator app.</div>
          <div className="mb-2">To finish enabling two factor autentication, please type the code you see in your authenticator app.</div>
          {backupCodes.length === 0 && <div className="flex">
            <div className="mb-1">
              <Textbox
                className=""
                placeholder="Authentication Code"
                onChange={(e) => setTextbox(e.target.value)}
                value={codeTextbox}
              />
            </div>
            <div className="ml-auto mt-0.5">
              <Button
                className="mr-2"
                onClick={() => {
                  setPage("start");
                }}
              >Back</Button>
              <Button
                onClick={() => {
                  const codeNumber = Number(codeTextbox);
                  if(codeNumber && !isNaN(codeNumber)) {
                    confirmTFA({variables: {token: codeNumber}}).then((data) => {
                      setCodes(data.data?.confirmTFA ?? []);
                      setPage("finished");
                    }).catch((err: Error) => {
                      Toasts.danger(err.message);
                    });
                  } else {
                    Toasts.danger("Invalid token.");
                  }
                }}
                intent={Intent.SUCCESS}
              >Check</Button>
            </div>
          </div>}
        </div>}
        {page === "finished" && <div className="flex flex-col">
          <div className="font-extrabold text-lg">Two Factor Authentication is now enabled!</div>
          <div className="">
            If you lose your phone, or lose access to your authenticator app, you'll need these backup codes:
          </div>
          <div className="p-3 rounded bg-gray-200 dark:bg-gray-700 text-center mt-2 shadow-inner shadow-lg">
            {backupCodes.map((value) => (<div className="inline-block mr-2 font-mono font-bold text-xl">{value}</div>))}
          </div>
          <Button
            className="ml-auto mt-3"
            intent={Intent.SUCCESS}
            onClick={() => {
              setSecret("");
              setPage("start");
              setCodes([]);
              props.onClose();
              if(page === "finished") {
                props.onComplete();
              }
              
              // Reset the hasGeneratedTOTP flag
              // We don't want to generate a new TOTP secret instantly because
              // that would regenerate the secret.
              setTimeout(() => {
                hasGeneratedTOTP = false;
              }, 200);
            }}
          >Finish</Button>            
        </div>}
      </DialogBody>
    </Dialog>
  );
}

export default TFAWizard;
