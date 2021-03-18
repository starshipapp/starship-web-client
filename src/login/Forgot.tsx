import React, { useState } from "react";
import { Button, Classes, H1, Intent } from "@blueprintjs/core";
import "./css/Login.css";
import { useMutation } from "@apollo/client";
import resetPasswordMutation, { IResetPasswordMutationData } from "../graphql/mutations/users/resetPasswordMutation";
import { GlobalToaster } from "../util/GlobalToaster";
import { useHistory, useParams } from "react-router";
import { SHA256 } from "crypto-js";

interface IForgotParams {
  forgotdata: string
}

function Forgot(): JSX.Element {
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const history = useHistory();
  const {forgotdata} = useParams<IForgotParams>();
  const [resetPassword] = useMutation<IResetPasswordMutationData>(resetPasswordMutation);

  const reset = function() {
    const splitdata = forgotdata.split(":token:");
    if(password !== confirm) {
      GlobalToaster.show({message: "Passwords must match.", intent: Intent.DANGER});
      return;
    }
    resetPassword({variables: {password: SHA256(password).toString(), token: splitdata[1], userId: splitdata[0]}}).then(() => {
      GlobalToaster.show({message: "Sucessfully changed password.", intent: Intent.SUCCESS});
      history.push("/login");
    }).catch((error: Error) => {
      GlobalToaster.show({message: error.message, intent: Intent.DANGER});
    });
  };

  return (
    <div className="Login">
      <div className="Login-container">
        <div className="Login-center">
          <H1 className="Login-header">Reset Password</H1>
          <input value={password} onChange={(e) => setPassword(e.target.value)} className={Classes.INPUT + " " + Classes.LARGE + " Login-input"} placeholder="Password" type="password"/>
          <input value={confirm} onChange={(e) => setConfirm(e.target.value)} className={Classes.INPUT + " " + Classes.LARGE + " Login-input"} placeholder="Confirm Password" type="password"/>
          <Button text="Reset" onClick={() => reset()}/>
        </div>
      </div>
    </div>
  );
}

export default Forgot;