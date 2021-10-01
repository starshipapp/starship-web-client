import IUser from "../types/IUser";

function getCap(user: IUser): number {
  if(user.capWaived) {
    return Number.MAX_SAFE_INTEGER;
  } else {
    return 26843531856;
  }
}

export default getCap;