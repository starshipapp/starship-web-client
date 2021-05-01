/* eslint-disable semi */
import IPlanet from "./IPlanet";
import IUser from "./IUser";
import IFileComponent from "./IFileComponent";

export default interface IFileObject {
  id: string,
  path?: string[],
  name?: string,
  parent?: IFileObject,
  createdAt?: string,
  owner?: IUser,
  planet?: IPlanet,
  component?: IFileComponent,
  type?: string,
  fileType?: string,
  finishedUploading?: boolean,
  shareId?: string,
  size?: number
}