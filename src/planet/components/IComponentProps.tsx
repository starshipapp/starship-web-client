import IPlanet from "../../types/IPlanet";

/* eslint-disable semi */
export default interface IComponentProps {
  planet: IPlanet,
  id: string,
  name: string,
  subId?: string,
  pageId?: string,
}