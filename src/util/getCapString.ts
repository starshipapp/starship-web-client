import IUser from "../types/IUser";

function getCapString(user: IUser): string {
  if(user.capWaived) {
    return "∞";
  } else {
    return "25 GB";
  }
}

export default getCapString;