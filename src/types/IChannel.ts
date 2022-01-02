/* eslint-disable semi */

import IChat from "./IChat";
import IMessage from "./IMessage";
import IPlanet from "./IPlanet";
import IUser from "./IUser";

export default interface IChannel {
  id: string;
  name?: string;
  type?: number;
  topic?: string;
  createdAt?: string;
  component?: IChat;
  planet?: IPlanet;
  owner?: IUser;
  users?: IUser[];
  unread?: boolean;
  mentioned?: boolean;
  lastRead?: string;
  messages?: {cursor: string, messages: IMessage[]};
  pinnedMessages?: {cursor: string, messages: IMessage[]};
}