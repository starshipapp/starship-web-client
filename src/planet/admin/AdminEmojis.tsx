import IPlanet from "../../types/IPlanet";
import React, { useRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import uploadCustomEmojiMutation, { IUploadCustomEmojiData } from "../../graphql/mutations/customemojis/uploadCustomEmojiMutation";
import deleteCustomEmojiMutation, { IDeleteCustomEmojiData } from "../../graphql/mutations/customemojis/deleteCustomEmojiMutation";
import axios from "axios";
import MimeTypes from "../../util/validMimes";
import getPlanet, { IGetPlanetData } from "../../graphql/queries/planets/getPlanet";
import SubPageHeader from "../../components/subpage/SubPageHeader";
import List from "../../components/list/List";
import Button from "../../components/controls/Button";
import Intent from "../../components/Intent";
import { faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import Popover from "../../components/overlays/Popover";
import Textbox from "../../components/input/Textbox";
import Toasts from "../../components/display/Toasts";
import ListItem from "../../components/list/ListItem";

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
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full">
      <SubPageHeader>Emojis</SubPageHeader>
      <List
        actions={<Popover
          popoverTarget={<Button 
            icon={faUpload} 
            minimal 
            small
            onClick={() => setPopover(true)}
          >
            Upload Emoji
          </Button>}
          open={showPopover}
          onClose={() => {
            setPopover(false);
            setEmojiFile(null);
            setEmojiName("");
          }}
        >
          <div>
            <Textbox
              placeholder="Emoji Name"
              value={emojiName}
              onChange={(e) => setEmojiName(e.target.value)}
              className="mb-2"
            /> 
            <input
              type="file"
              className="hidden"
              accept={MimeTypes.imageTypes.join(",")}
              onChange={(e) => {
                if(e.target.files && e.target.files[0]) {
                  setEmojiFile(e.target.files[0]);
                }
              }}
              ref={inputRef}
            />
            <Button
              intent={emojiFile ? Intent.SUCCESS : undefined}
              className="mb-3 w-full block"
              icon={faUpload}
              onClick={() => {
                inputRef?.current && inputRef.current.click();
              }}
            >
              {emojiFile ? emojiFile.name : "Choose file..."}
            </Button>
            <Button
              icon={faUpload}
              onClick={() => {
                if(emojiName === "") {
                  Toasts.danger("Your emoji must have a name.");
                  return;
                }
                if(!emojiFile) {
                  Toasts.danger("Please select a file to upload.");
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
                    }).catch((e: Error) => {
                      Toasts.danger(e.message);
                    });
                  }
                }).catch((error: Error) => {
                  Toasts.danger(error.message);
                });
              }}
            >
              Upload
            </Button>
          </div>
        </Popover>}
        name={`${props.planet.customEmojis?.length ?? 0}/50 slots used`}
      >
        {props.planet.customEmojis?.map((value) => (
          <ListItem
            icon={<img className="h-6 w-6" src={value.url} alt={value.name}/>}
            actions={<Button
              icon={faTrash}
              intent={Intent.DANGER}
              small
              onClick={() => {
                deleteEmoji({variables: {emojiId: value.id}}).then(() => {
                  Toasts.success(`Successfully deleted :${value.name ?? ""}:.`);
                  void refetch();
                }).catch((error: Error) => {
                  Toasts.danger(error.message);
                });
              }}
            />}
          >
            :{value.name}:
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default AdminEmojis;
