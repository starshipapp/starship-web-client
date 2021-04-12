import IUser from "../types/IUser";

function getCap(user: IUser): number {
  if(user.capWaived) {
    return 9223372036854775806;
  } else {
    return 26843531856;
  }
}

export default getCap;