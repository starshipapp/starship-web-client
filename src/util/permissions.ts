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

    if(planet.members && planet.members.some(e => e.id === user.id)) {
      return true;
    }

    if(planet.owner?.id === user.id) {
      return true;
    }

    return false;
  } else {
    return false;
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

    if(planet.banned && planet.banned.some(e => e.id === user.id)) {
      return false;
    }

    if(!planet.private) {
      return true;
    }

    if(planet.members && planet.members.some(e => e.id === user.id)) {
      return true;
    }

    if(planet.owner?.id === user.id) {
      return true;
    }

    return false;
  } else {
    return false;
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

    if(planet.banned && planet.banned.some(e => e.id === user.id)) {
      return false;
    }

    if(planet.members && planet.members.some(e => e.id === user.id)) {
      return true;
    }

    if(planet.owner?.id === user.id) {
      return true;
    }

    return false;
  } else {
    return false;
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

const permissions = {checkAdminPermission, checkReadPermission, checkPublicWritePermission, checkFullWritePermission};

export default permissions;
