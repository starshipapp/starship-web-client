import { useMutation, useQuery } from "@apollo/client";
import React, {useEffect, useState} from "react";
import signInMutation, { ISignInMutationData } from "../graphql/mutations/users/signInMutation";
import sha256 from 'crypto-js/sha256';
import signUpMutation, { ISignUpMutationData } from "../graphql/mutations/users/signUpMutation";
import getCurrentUser, { IGetCurrentUserData } from "../graphql/queries/users/getCurrentUser";
import { Link, useHistory } from "react-router-dom";
import sendResetPasswordEmailMutation, { ISendResetPasswordEmailMutationData } from "../graphql/mutations/users/sendResetPasswordEmailMutation";
import resendVerificationEmailMutation, { IResendVerificationEmailMutationData } from "../graphql/mutations/users/resendVerificationEmailMutation";
import ReCAPTCHA from "react-google-recaptcha";
import TFAPrompt from "../util/TFAPrompt";
import finalizeAuthorizationMutation, { IFinalizeAuthorizationMutationData } from "../graphql/mutations/users/finalizeAuthorizationMutation";
import logo from '../assets/images/logo.svg';
import blackLogo from '../assets/images/black-logo.svg';
import Label from "../components/text/Label";
import Textbox from "../components/input/Textbox";
import Toasts from "../components/display/Toasts";
import Button from "../components/controls/Button";
import Intent from "../components/Intent";

let tfaToken = "";

interface ILoginProps {
  forcefullyResetLink: () => void;
}

function Login(props: ILoginProps): JSX.Element {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [signIn] = useMutation<ISignInMutationData>(signInMutation);
  const [sendResetPasswordEmail] = useMutation<ISendResetPasswordEmailMutationData>(sendResetPasswordEmailMutation);
  const [resendVerificationEmail] = useMutation<IResendVerificationEmailMutationData>(resendVerificationEmailMutation);
  const [finalizeAuthorization] = useMutation<IFinalizeAuthorizationMutationData>(finalizeAuthorizationMutation);

  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [showReset, setShowReset] = useState<boolean>(false);
  const [registerUsername, setRegisterUsername] = useState<string>("");
  const [registerPasword, setRegisterPassword] = useState<string>("");
  const [confirmPassword, setConfirm] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [signUp] = useMutation<ISignUpMutationData>(signUpMutation);
  const [recaptcha, setRecaptcha] = useState<string>("");
  const [showTFADialog, setTFADialog] = useState<boolean>(false);

  const { client, loading } = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });

  const history = useHistory();

  useEffect(() => {
    document.title = "Login | starship";
  });

  const register = function() {
    if (registerUsername === "") {
      Toasts.danger("Username cannot be empty.");
      return;
    }
    if (registerPasword === "") {
      Toasts.danger("Password cannot be empty.");
      return;
    }
    if (registerPasword !== confirmPassword) {
      Toasts.danger("Passwords do not match.");
      return;
    }
    if (email === "") {
      Toasts.danger("Email cannot be empty.");
      return;
    }

    signUp({ variables: { username: registerUsername, password: sha256(registerPasword).toString(), email, recaptcha } }).then((value) => {
      if (value.data) {
        if (value.data.insertUser.id) {
          // TODO: better flow for account verification
          Toasts.success("Account created successfully. Please check your email for a verification link.");
          setRegisterPassword("");
          setRegisterUsername("");
          setConfirm("");
          setEmail("");
        }
      }
    }).catch((error: Error) => {
      Toasts.danger(error.message);
    });
  };
  
  const sendResetEmail = function() {
    sendResetPasswordEmail({variables: {username}}).then((value) => {
      if(value) {
        Toasts.success("Reset email sent successfully.");
      }
    }).catch((error: Error) => {
      Toasts.danger(error.message);
    });
  };

  const sendVerificationEmail = function () {
    resendVerificationEmail({variables: {username}}).then((value) => {
      if(value) {
        Toasts.success("Verification email sent successfully.");
      }
    }).catch((error: Error) => {
      Toasts.danger(error.message);
    });
  };

  const signInFunction = function() {
    signIn({ variables: { username, password: sha256(password).toString() } }).then((value) => {
      if(value.data) {
        if(value.data.loginUser.expectingTFA) {
          tfaToken = value.data.loginUser.token;
          setTFADialog(true);
        } else {
          localStorage.setItem("token", value.data.loginUser.token);
          Toasts.success("Signed in successfully.");
          void client.resetStore();
          props.forcefullyResetLink();
          setUsername("");
          setPassword("");
          history.push("/");
        }
      }
    }).catch((error: Error) => {
      if(error.message === "Incorrect username or password.") {
        Toasts.danger("Incorrect username or password.");
        setShowReset(true);
      } else if(error.message === "You need to verify your email.") {
        // TODO: better flow for account verification
        Toasts.danger("You need to verify your email.");
      } else {
        Toasts.danger(error.message);
      }
    });
  };

  return (
    <div className="flex bg-gray-50 h-screen w-screen dark:bg-gray-900 flex-col">
      <TFAPrompt
        isOpen={showTFADialog}
        onClose={() => setTFADialog(false)}
        onSubmit={(key) => {
          finalizeAuthorization({variables: {loginToken: tfaToken, totpToken: key}}).then((data) => {
            if(data.data) {
              localStorage.setItem("token", data.data.finalizeAuthorization.token);
              Toasts.success("Signed in successfully.");
              void client.resetStore();
              props.forcefullyResetLink();
              setUsername("");
              setPassword("");
              history.push("/");
            }
          }).catch((err: Error) => {
            Toasts.danger(err.message);
          });
        }}
      />
      <div className="m-auto text-black dark:text-white flex flex-col">
        <div className="mx-auto mb-6">
          <img src={logo} alt="logo" className="h-10 hidden dark:block"/>  
          <img src={blackLogo} alt="logo" className="h-10 dark:hidden"/>  
        </div>
        <div className="bg-transparent rounded-xl shadow-lg flex">
          <div className={`w-96 p-5 bg-gray-100 dark:bg-gray-800 rounded-lg transition-all overflow-hidden flex flex-col ${isRegistering ? (process.env.REACT_APP_RECAPTCHA_KEY ? "h-registration-with-recaptcha" : "h-96") : "h-64"}`}>
            {!isRegistering && <div>
              <div className="text-4xl font-extrabold -mt-1">Login</div>
              <Label className="mt-3">Username</Label>
              <Textbox
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
              />
              <Label className="mt-2">Password</Label>
              <Textbox
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                type="password"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    signInFunction();
                  }
                }}
              />
              <div className="mt-4 flex">
                <Button
                  onClick={() => {
                    setIsRegistering(true);
                    setRegisterUsername(username);
                    setRegisterPassword(password);
                  }}
                >Register</Button>
                <Button
                  disabled={loading}
                  onClick={signInFunction}
                  intent={Intent.PRIMARY}
                  className="ml-auto"
                >Login</Button> 
              </div>
            </div>}
            {isRegistering && <div className="flex flex-col">
              <div className="text-4xl font-extrabold -mt-1">Register</div>
              <Label className="mt-3">Username</Label>
              <Textbox
                placeholder="Username"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
                className="w-full"
              />
              <Label className="mt-2">Password</Label>
              <Textbox
                placeholder="Password"
                value={registerPasword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className="w-full"
                type="password"
              />
              <Label className="mt-2">Confirm Password</Label>
              <Textbox
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full"
                type="password"
              />
              <Label className="mt-2">Email</Label>
              <Textbox
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    register();
                  }
                }}
              />
              {process.env.REACT_APP_RECAPTCHA_KEY && <div className="mx-auto mt-4">
                <ReCAPTCHA
                  sitekey={process.env.REACT_APP_RECAPTCHA_KEY}
                  onChange={(value) => setRecaptcha(value ?? "")}
                  theme="dark"
                  size="normal"
                />
              </div>}
              <div className="mt-4 flex">
                <Button
                  onClick={() => setIsRegistering(false)}
                >Login</Button>
                <Button
                  disabled={loading}
                  onClick={register}
                  intent={Intent.PRIMARY}
                  className="ml-auto"
                >Register</Button> 
              </div>
            </div>}
          </div>
        </div>
        <Button
          onClick={sendResetEmail}
          minimal
          className={`mt-4 opacity-0 transition-all ${showReset && username.length > 3 ? "opacity-100" : ""}`}
        >Forgot your password?</Button>
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
} 

export default Login;
