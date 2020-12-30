import IPlanet from "./IPlanet";
import IUser from "./IUser";
import IWikiPage from "./IWikiPage";

/* eslint-disable semi */
export default interface IWiki {
  id: string
  createdAt?: string,
  owner?: IUser,
  updatedAt?: string,
  planet?: IPlanet,
  pages?: IWikiPage[]
}