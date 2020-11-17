import IPlanet from "../types/IPlanet";
import IUser from "../types/IUser";

function checkReadPermission(user: IUser, planet: IPlanet): boolean {
  if (user && planet) {
    if(user && user.admin) {
      return true;
    }

    if(!planet.private) {
      return true;
    }

    if(planet.members && planet.members.includes({id: user.id, username: user.username})) {
      return true;
    }

    if(planet.owner?.id === user.id) {
      return true;
    }

    return false;
  } else {
    throw new Error("missing-id");
  }
}

function checkPublicWritePermission(user: IUser, planet: IPlanet): boolean {
  if (user && planet) {
    if(user && user.banned) {
      return false;
    }

    if(user && user.admin) {
      return true;
    }

    if(planet.banned && planet.banned.includes({id: user.id})) {
      return false;
    }

    if(!planet.private) {
      return true;
    }

    if(planet.members && planet.members.includes({id: user.id})) {
      return true;
    }

    if(planet.owner?.id === user.id) {
      return true;
    }

    return false;
  } else {
    throw new Error("missing-id");
  }
}

function checkFullWritePermission(user: IUser, planet: IPlanet): boolean {
  if (user && planet) {
    if(user && user.banned) {
      return false;
    }

    if(user && user.admin) {
      return true;
    }

    if(planet.banned && planet.banned.includes({id: user.id})) {
      return false;
    }

    if(planet.members && planet.members.includes({id: user.id})) {
      return true;
    }

    if(planet.owner?.id === user.id) {
      return true;
    }

    return false;
  } else {
    throw new Error("missing-id");
  }
}

function checkAdminPermission(user: IUser): boolean {
  if(user === undefined) {
    throw new Error("missing-user");
  }

  if(user && user?.admin) {
    return true;
  }
  return false;
}

export default {checkAdminPermission, checkReadPermission, checkPublicWritePermission, checkFullWritePermission};