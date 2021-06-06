import { useMutation, useQuery } from "@apollo/client";
import { Button, Intent, Spinner } from "@blueprintjs/core";
import React from "react";
import removeMemberMutation, { IRemoveMemberMutationData } from "../../graphql/mutations/planets/removeMemberMutation";
import getUser, { IGetUserData } from "../../graphql/queries/users/getUser";
import { GlobalToaster } from "../../util/GlobalToaster";

interface IMemberTableItemProps {
  userId: string
  planetId: string
}

function MemberTableItem(props: IMemberTableItemProps): JSX.Element {
  const {data, loading} = useQuery<IGetUserData>(getUser, {variables: {id: props.userId}});
  const [removeMember] = useMutation<IRemoveMemberMutationData>(removeMemberMutation);

  return (
    <tr>
      <td className="AdminComponents-table-name">{data?.user ? (data?.user && data?.user.username) : <Spinner className="spinner-inline" size={Spinner.SIZE_SMALL}/>}</td>
      {!loading && data?.user && <td className="AdminComponents-table-action"><Button intent="danger" small={true} minimal={true} icon="trash" onClick={() => {
        removeMember({variables: {planetId: props.planetId, userId: props.userId}}).then(() => {
          GlobalToaster.show({message: `Sucessfully removed ${data.user.username as unknown as string} from the planet.`, intent: Intent.SUCCESS});
        }).catch((err: Error) => {
          GlobalToaster.show({message: err.message, intent: Intent.DANGER});
        });
      }}/></td>}
    </tr>
  );
}

export default MemberTableItem;