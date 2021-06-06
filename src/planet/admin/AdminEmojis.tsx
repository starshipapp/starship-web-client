import IPlanet from "../../types/IPlanet";
import React, { useState } from "react";
import "./css/AdminGeneral.css";
import "./css/AdminExperimental.css";
import { Button, Classes, FileInput, Intent, Popover } from "@blueprintjs/core";
import { useMutation, useQuery } from "@apollo/client";
import { GlobalToaster } from "../../util/GlobalToaster";
import uploadCustomEmojiMutation, { IUploadCustomEmojiData } from "../../graphql/mutations/customemojis/uploadCustomEmojiMutation";
import deleteCustomEmojiMutation, { IDeleteCustomEmojiData } from "../../graphql/mutations/customemojis/deleteCustomEmojiMutation";
import axios from "axios";
import MimeTypes from "../../util/validMimes";
import getPlanet, { IGetPlanetData } from "../../graphql/queries/planets/getPlanet";

interface IAdminEmojisProps {
  planet: IPlanet
}

function AdminEmojis(props: IAdminEmojisProps): JSX.Element {
  const [emojiName, setEmojiName] = useState<string>("");
  const [emojiFile, setEmojiFile] = useState<File | null>(null);
  const [showPopover, setPopover] = useState<boolean>(false);
  const {refetch} = useQuery<IGetPlanetData>(getPlanet, {variables: {planet: props.planet.id}, errorPolicy: 'all'});
  const [uploadEmoji] = useMutation<IUploadCustomEmojiData>(uploadCustomEmojiMutation);
  const [deleteEmoji] = useMutation<IDeleteCustomEmojiData>(deleteCustomEmojiMutation);

  return (
    <div className="Admin-page bp3-dark">
      <div>
        <h2>Emojis</h2>
        <div className="AdminGeneral-container">
          <div className="EmojiSettings">
            <div className="EmojiSettings-topbar">
              <div className="EmojiSettings-slots">
                {props.planet.customEmojis?.length}/50 slots used
              </div>
              <Popover
                isOpen={showPopover}
                onClose={() => {
                  setPopover(false);
                  setEmojiFile(null);
                  setEmojiName("");
                }}
              >
                <Button icon="upload" text="Upload Emoji" minimal={true} small={true} onClick={() => setPopover(true)}/>
                <div className="menu-form">
                  <input
                    className={`menu-input EmojiSettings-input ${Classes.INPUT}`}
                    placeholder="Emoji Name"
                    value={emojiName}
                    onChange={(e) => setEmojiName(e.target.value)}
                  />
                  <FileInput
                    text={emojiFile ? emojiFile.name : "Choose file.." }
                    hasSelection={!!emojiFile}
                    className="EmojiSettings-file-input"
                    inputProps={{
                      accept: MimeTypes.imageTypes.join(",")
                    }}
                    onInputChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if(e.target.files && e.target.files[0]) {
                        setEmojiFile(e.target.files[0]);
                      }
                    }}
                  />
                  <Button
                    text="Upload"
                    icon="upload"
                    className="menu-button"
                    onClick={() => {
                      if(emojiName === "") {
                        GlobalToaster.show({message: "Your emoji must have a name.", intent: Intent.DANGER});
                        return;
                      }
                      if(!emojiFile) {
                        GlobalToaster.show({message: "Please select a file to upload.", intent: Intent.DANGER});
                        return;
                      }
                      uploadEmoji({variables: {name: emojiName, type: emojiFile.type, size: emojiFile.size, planetId: props.planet.id}}).then((data) => {
                        if(data.data?.uploadCustomEmoji) {
                          const options = { headers: { "Content-Type": emojiFile.type, "x-amz-acl": "public-read" }};
                          axios.put(data.data?.uploadCustomEmoji, emojiFile, options).then(() => {
                            void refetch();
                            setPopover(false);
                            setEmojiFile(null);
                            setEmojiName("");
                          }).catch(function (error) {
                            // handle error
                          });
                        }
                      }).catch((error: Error) => {
                        GlobalToaster.show({message: error.message, intent: Intent.DANGER});
                      });
                    }}
                  />
                </div>
              </Popover>
            </div>
            <div className="EmojiSettings-table">
              {props.planet.customEmojis?.map((value) => (<div className="EmojiSettings-emoji">
                <img className="EmojiSettings-emoji-icon" src={value.url} alt={value.name}/>
                <div className="EmojiSettings-emoji-name">
                  :{value.name}:
                </div>
                <Button
                  className="EmojiSettings-emoji-button"
                  icon="trash"
                  intent={Intent.DANGER}
                  minimal={true}
                  small={true}
                  onClick={() => {
                    deleteEmoji({variables: {emojiId: value.id}}).then(() => {
                      GlobalToaster.show({message: `Successfully deleted ${value.name ?? ""}.`, intent: Intent.SUCCESS});
                      void refetch();
                    }).catch((error: Error) => {
                      GlobalToaster.show({message: error.message, intent: Intent.DANGER});
                    });
                  }}
                />
              </div>))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminEmojis;