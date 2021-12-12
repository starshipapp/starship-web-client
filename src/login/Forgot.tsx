import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import resetPasswordMutation, { IResetPasswordMutationData } from "../graphql/mutations/users/resetPasswordMutation";
import { useNavigate, useParams } from "react-router";
import { SHA256 } from "crypto-js";
import logo from '../assets/images/logo.svg';
import blackLogo from '../assets/images/black-logo.svg';
import Label from "../components/text/Label";
import Textbox from "../components/input/Textbox";
import Toasts from "../components/display/Toasts";
import Button from "../components/controls/Button";
import Intent from "../components/Intent";
import { Link } from "react-router-dom";

function Forgot(): JSX.Element {
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const navigate = useNavigate();
  const {forgotdata} = useParams();
  const [resetPassword] = useMutation<IResetPasswordMutationData>(resetPasswordMutation);

  const reset = function() {
    const splitdata = forgotdata ? forgotdata.split(":token:") : [];
    if(password !== confirm) {
      Toasts.danger("Passwords do not match.");
      return;
    }
    resetPassword({variables: {password: SHA256(password).toString(), token: splitdata[1], userId: splitdata[0]}}).then(() => {
      Toasts.success("Password reset successfully.");
      navigate("/login");
    }).catch((error: Error) => {
      Toasts.danger(error.message);
    });
  };

return (
    <div className="flex bg-gray-50 h-screen w-screen dark:bg-gray-900 flex-col">
      <div className="m-auto text-black dark:text-white flex flex-col">
        <div className="mx-auto mb-6">
          <img src={logo} alt="logo" className="h-10 hidden dark:block"/>  
          <img src={blackLogo} alt="logo" className="h-10 dark:hidden"/>  
        </div>
        <div className="bg-transparent rounded-xl shadow-lg flex">
          <div className={`w-96 p-5 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex flex-col`}>
            <div>
              <div className="text-4xl font-extrabold -mt-1">Reset Password</div>
              <Label className="mt-3">Password</Label>
              <Textbox
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                type="password"
              />
              <Label className="mt-2">Confirm Password</Label>
              <Textbox
                placeholder="Confirm Password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full"
                type="password"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    reset();
                  }
                }}
              />
              <div className="mt-4 flex">
                <Button
                  onClick={reset}
                  intent={Intent.PRIMARY}
                  className="ml-auto"
                >Reset</Button> 
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center dark:text-white">
        <span className="font-bold">© Starship 2020 - 2021. All rights reserved.</span>
        <span className="block">
          <Link className="font-bold mr-2" to="/terms">Terms</Link>
          <Link className="font-bold mr-2" to="/privacy">Privacy Policy</Link> 
          <Link className="font-bold mr-2" to="/rules">Rules</Link>
        </span>
      </div>
    </div>
  );

  /* return (
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
  ); */
}

export default Forgot;
