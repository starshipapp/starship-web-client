import { useMutation, useQuery } from "@apollo/client";
import { Icon, Intent } from "@blueprintjs/core";
import axios from "axios";
import React, { useRef } from "react";
import uploadProfilePictureMutation, { IUploadProfilePictureMutationData } from "../graphql/mutations/users/uploadProfilePictureMutation";
import getCurrentUser, { IGetCurrentUserData } from "../graphql/queries/users/getCurrentUser";
import { GlobalToaster } from "../util/GlobalToaster";
import "./css/Settings.css";

function Settings(): JSX.Element {
  const fileInput = useRef<HTMLInputElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const {data: userData, refetch} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });
  const [uploadProfilePicture] = useMutation<IUploadProfilePictureMutationData>(uploadProfilePictureMutation);

  return (
    <div className="Settings bp3-dark">
      <input
        type="file"
        ref={fileInput}
        id="upload-button"
        style={{ display: "none" }}
        onChange={(e) => {
          if(!e.target.files) {
            return false;
          }
          const file = e.target.files[0];
          uploadProfilePicture({variables: {type: file.type, size: file.size}}).then((data) => {
            const options = { headers: { "Content-Type": file.type, "x-amz-acl": "public-read" }};
            if(!data.data?.uploadProfilePicture) {
              GlobalToaster.show({message: "The server did not return an address to upload.", intent: Intent.DANGER});
              return;
            }
            axios.put(data.data?.uploadProfilePicture, file, options).then(() => {
              refetch().then((data) => {
                if(!image.current) {
                  return;
                }
                image.current.src = (data.data.currentUser.profilePicture ?? "") + "?t=" + String(Number(Date.now()));
              }).catch(() => {
                GlobalToaster.show({message: "Unable to fetch new user data.", intent: Intent.DANGER});
              });
            }).catch(function (error) {
              // handle error
              console.log(error);
            });
          }).catch((error: Error) => {
            GlobalToaster.show({message: error.message, intent: Intent.DANGER});
          });
        }}
      />
      <div className="Settings-header">
        <div className="Settings-header-text">
          Settings
        </div>
      </div>
      <div className="Settings-container">
        <h1>Profile Picture</h1>
        <div className="Settings-profilepic" onClick={() => fileInput.current?.click()}>
          {/* eslint-disable-next-line jsx-a11y/img-redundant-alt*/}
          {userData?.currentUser && userData?.currentUser.profilePicture && <img alt="Change profile picture" src={userData.currentUser.profilePicture + "?t=" + String(Number(Date.now()))} ref={image}/>}
          <Icon icon="upload" className="Settings-uploadpfp"/>
        </div>
      </div>
    </div>
  );
}

export default Settings;