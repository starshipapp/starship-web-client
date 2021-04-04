import { useMutation, useQuery } from "@apollo/client";
import { Button, Classes, Divider, H1, Intent, NonIdealState } from "@blueprintjs/core";
import React, {useEffect, useState} from "react";
import signInMutation, { ISignInMutationData } from "../graphql/mutations/users/signInMutation";
import "./css/Login.css";
import sha256 from 'crypto-js/sha256';
import signUpMutation, { ISignUpMutationData } from "../graphql/mutations/users/signUpMutation";
import { GlobalToaster } from "../util/GlobalToaster";
import getCurrentUser, { IGetCurrentUserData } from "../graphql/queries/users/getCurrentUser";
import { useHistory } from "react-router-dom";
import sendResetPasswordEmailMutation, { ISendResetPasswordEmailMutationData } from "../graphql/mutations/users/sendResetPasswordEmailMutation";
import resendVerificationEmailMutation, { IResendVerificationEmailMutationData } from "../graphql/mutations/users/resendVerificationEmailMutation";

function Login(): JSX.Element {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [signIn] = useMutation<ISignInMutationData>(signInMutation);
  const [sendResetPasswordEmail] = useMutation<ISendResetPasswordEmailMutationData>(sendResetPasswordEmailMutation);
  const [resendVerificationEmail] = useMutation<IResendVerificationEmailMutationData>(resendVerificationEmailMutation);

  const [registerUsername, setRegisterUsername] = useState<string>("");
  const [registerPasword, setRegisterPassword] = useState<string>("");
  const [confirmPassword, setConfirm] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [signUp] = useMutation<ISignUpMutationData>(signUpMutation);

  const { client, loading, data } = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });

  const history = useHistory();

  useEffect(() => {
    document.title = "Login | starship";
  });

  const register = function() {
    if (registerUsername === "") {
      GlobalToaster.show({ intent: "danger", message: "You need to set a username." });
      return;
    }
    if (registerPasword === "") {
      GlobalToaster.show({ intent: "danger", message: "You need to set a password." });
      return;
    }
    if (registerPasword !== confirmPassword) {
      GlobalToaster.show({ intent: "danger", message: "Your passwords do not match!" });
      return;
    }
    if (email === "") {
      GlobalToaster.show({ intent: "danger", message: "You need to set your email." });
      return;
    }

    signUp({ variables: { username: registerUsername, password: sha256(registerPasword).toString(), email, recaptcha: "" } }).then((value) => {
      if (value.data) {
        if (value.data.insertUser.id) {
          GlobalToaster.show({ intent: "success", message: "Sucessfully registered! Check your email to verify." });
          setRegisterPassword("");
          setRegisterUsername("");
          setConfirm("");
          setEmail("");
        }
      }
    }).catch((error: Error) => {
      GlobalToaster.show({ intent: "danger", message: error.message });
    });
  };
  
  const sendResetEmail = function() {
    sendResetPasswordEmail({variables: {username}}).then((value) => {
      if(value){
        GlobalToaster.show({message: "An email to reset your password has been sent.", intent: Intent.SUCCESS});
      }
    }).catch((error: Error) => {
      GlobalToaster.show({message: error.message, intent: Intent.DANGER});
    });
  };

  const sendVerificationEmail = function () {
    resendVerificationEmail({variables: {username}}).then((value) => {
      GlobalToaster.show({message: "An email to verify your account has been sent."});
    }).catch((error: Error) => {
      GlobalToaster.show({message: error.message, intent: Intent.DANGER});
    });
  };

  const signInFunction = function() {
    signIn({ variables: { username, password: sha256(password).toString() } }).then((value) => {
      if (value.data) {
        localStorage.setItem("token", value.data.loginUser.token);
        GlobalToaster.show({ intent: "success", message: "Sucessfully logged in." });
        void client.resetStore();
        setUsername("");
        setPassword("");
        history.push("/");
      }
    }).catch((error: Error) => {
      if(error.message === "Incorrect username or password.") {
        GlobalToaster.show({message: error.message, intent: Intent.DANGER, action: {text: "Reset Password", onClick: () => sendResetEmail()}});
      } if(error.message === "You need to verify your email.") {
        GlobalToaster.show({message: error.message, intent: Intent.DANGER, action: {text: "Resend Email", onClick: () => sendVerificationEmail()}});
      } else {
        console.log(error.message);
        GlobalToaster.show({message: error.message, intent: Intent.DANGER});
      }
    });
  };

  return (
    <div className="Login">
      <div className="Login-container">
        {loading ? <div>Loading...</div> : (data?.currentUser ? <NonIdealState
          icon="user"
          title="You're already logged in."
          description={`You're already logged in as ${data.currentUser?.username?.toString() as string}. Would you like to logout?`}
          action={<Button text="Logout" onClick={() => {
            localStorage.removeItem("token");
            void client.cache.gc();
            void client.resetStore();
          }}/>}
        /> : <><div className="Login-left">
          <H1 className="Login-header">Login</H1>
          <input value={username} onChange={(e) => setUsername(e.target.value)} className={Classes.INPUT + " " + Classes.LARGE + " Login-input"} placeholder="Username" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} className={Classes.INPUT + " " + Classes.LARGE + " Login-input"} placeholder="Password" type="password" onKeyDown={(e) => {
              if(e.key === "Enter") {
                signInFunction();
              }
            }}/>
          <Button text="Login" onClick={() => signInFunction()} />
        </div><Divider />
        <div className="Login-right">
          <H1 className="Login-header">Register</H1>
          <input value={registerUsername} onChange={(e) => setRegisterUsername(e.target.value)} className={Classes.INPUT + " " + Classes.LARGE + " Login-input"} placeholder="Username" />
          <input value={registerPasword} onChange={(e) => setRegisterPassword(e.target.value)} className={Classes.INPUT + " " + Classes.LARGE + " Login-input"} placeholder="Password" type="password" />
          <input value={confirmPassword} onChange={(e) => setConfirm(e.target.value)} className={Classes.INPUT + " " + Classes.LARGE + " Login-input"} placeholder="Confirm Password" type="password" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} className={Classes.INPUT + " " + Classes.LARGE + " Login-input"} placeholder="Email" type="email" onKeyDown={(e) => {
            if(e.key === "Enter") {
              register();
            }
          }}/>
          <Button text="Register" onClick={() => register()} />
        </div></>)}
      </div>
    </div>
  );
} 

export default Login;