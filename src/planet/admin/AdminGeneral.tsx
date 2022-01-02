import IPlanet from "../../types/IPlanet";
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import updateNameMutation, { IUpdateNameMutationData } from "../../graphql/mutations/planets/updateNameMutation";
import togglePrivateMutation, { ITogglePrivateMutationData } from "../../graphql/mutations/planets/togglePrivateMutation";
import setDescriptionMutation, { ISetDescriptionMutationData } from "../../graphql/mutations/planets/setDescriptionMutation";
import getCurrentUser, { IGetCurrentUserData } from "../../graphql/queries/users/getCurrentUser";
import deletePlanetMutation, { IDeletePlanetMutationData } from "../../graphql/mutations/planets/deletePlanetMutation";
import SubPageHeader from "../../components/subpage/SubPageHeader";
import Callout from "../../components/text/Callout";
import Intent from "../../components/Intent";
import Label from "../../components/text/Label";
import Textbox from "../../components/input/Textbox";
import Button from "../../components/controls/Button";
import Toasts from "../../components/display/Toasts";
import TextArea from "../../components/input/TextArea";
import Confirm from "../../components/dialog/Confirm";
import { useNavigate } from "react-router-dom";

interface IAdminGeneralProps {
  planet: IPlanet
}

function AdminGeneral(props: IAdminGeneralProps): JSX.Element {
  const {refetch} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });
  const [nameTextboxContents, updateNameTextbox] = useState<string>(props.planet.name ?? "");
  const [descTextboxContents, updateDescTextbox] = useState<string>(props.planet.description ?? "");
  const [isOpen, setOpen] = useState<boolean>(false);
  const [openType, setType] = useState<string>("");
  const [setName] = useMutation<IUpdateNameMutationData>(updateNameMutation);
  const [setDescription] = useMutation<ISetDescriptionMutationData>(setDescriptionMutation);
  const [togglePrivate] = useMutation<ITogglePrivateMutationData>(togglePrivateMutation);
  const [deletePlanet] = useMutation<IDeletePlanetMutationData>(deletePlanetMutation);
  const navigate = useNavigate();

  const doVerify = function() {
    if(openType === "private") {
      togglePrivate({variables: {planetId: props.planet.id}}).then((data) => {
        Toasts.success(`Planet ${props.planet.name ?? ""} is now ${data.data?.togglePrivate.private ? "private" : "public"}.`);
      }).catch((err: Error) => {
        Toasts.danger(err.message);
      });
    } else if(openType === "delete") {
      deletePlanet({variables: {planetId: props.planet.id}}).then(async () => {
        Toasts.success(`Planet ${props.planet.name ?? ""} has been deleted.`);
        await refetch();
        navigate("/");
      }).catch((err: Error) => {
        Toasts.danger(err.message);
      });
    }
  };

  return (
    <div className="w-full">
      <Confirm
        open={isOpen}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          doVerify();
          setOpen(false);
        }}
        confirmString={props.planet.name ?? "unknown planet"}
      >
        {openType === "delete" && <span>You are about to <b>delete</b> your planet.</span>}
        {openType === "private" && <span>You are about to <b>set the visibility</b> of your planet.</span>}
      </Confirm>
      <div className="w-full">
        <SubPageHeader>General</SubPageHeader>
        <div>
          <Label>
            Name
          </Label>
          <Textbox
            value={nameTextboxContents}
            onChange={(e) => updateNameTextbox(e.target.value)}
            placeholder="Name"
          />
          <Button className={"block mt-3 mb-2"} onClick={() => {
            setName({variables: {planetId: props.planet.id, name: nameTextboxContents}}).then(() => {
              Toasts.success(`Sucessfully changed planet name to ${nameTextboxContents}.`);
            }).catch((err: Error) => {
              Toasts.danger(err.message);
            });
          }}>Save</Button>
          <Label>
            Description
          </Label>
          <TextArea
            className="w-80 h-36"
            value={descTextboxContents}
            onChange={(e) => updateDescTextbox(e.target.value)}
          />
          <Button className="block mt-3 mb-3" onClick={() => {
            setDescription({variables: {planetId: props.planet.id, description: descTextboxContents}}).then(() => {
              Toasts.success(`Sucessfully changed planet description.`);
            }).catch((err: Error) => {
              Toasts.danger(err.message);
            });
          }}>Save</Button>
          <Callout title="Danger Zone" intent={Intent.DANGER}>
            <div>
              These buttons make important changes to your planet. Make sure you know what you're doing before using them.
            </div>
            <Button
              className="mb-2 mt-2"
              intent={Intent.DANGER}
              onClick={() => {
                setOpen(true);
                setType("private");
              }}
            >{props.planet.private ? `Make ${props.planet.name ?? "this planet"} public` : `Make ${props.planet.name ?? "this planet"} private`}</Button><br/>
            <Button
              intent={Intent.DANGER}
              onClick={() => {
                setOpen(true);
                setType("delete");
              }}
            >{`Delete ${props.planet.name ?? "this planet"}`}</Button>
          </Callout>
        </div>
      </div>
    </div>
  );
}

export default AdminGeneral;
