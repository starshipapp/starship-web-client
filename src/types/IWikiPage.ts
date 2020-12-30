import IPlanet from "./IPlanet";
import IWiki from "./IWiki";

/* eslint-disable semi */
export default interface IWikiPage {
  id: string
  wiki?: IWiki
  content?: string
  planet?: IPlanet
  createdAt?: string,
  name?: string
}