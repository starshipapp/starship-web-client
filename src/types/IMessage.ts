/* eslint-disable semi */
import IAttachment from "./IAttachment";
import IChannel from "./IChannel";
import IUser from "./IUser";

export default interface IMessage {
  id: string;
  content?: string;
  createdAt?: string;
  pinned?: boolean;
  edited?: boolean;
  channel?: IChannel;
  owner?: IUser;
  mentions?: IUser[];
  reactions?: [{emoji: string, reactors: string[]}];
  parent?: IMessage;
  attachments?: IAttachment[];
}
