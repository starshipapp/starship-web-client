import IComponentProps from "./components/IComponentProps";
import PageComponent from "./components/PageComponent";
import React from "react";
import IPlanet from "../types/IPlanet";
import WikiComponent from "./components/wikis/WikiComponent";
import ForumComponent from "./components/forums/ForumComponent";
import FilesComponent from "./components/files/FilesComponent";
import {IconName} from "@blueprintjs/core";
import ChatComponent from "./components/chat/ChatComponent";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faComment, faCommentAlt, faCopy, faFileAlt, faFolderOpen } from "@fortawesome/free-solid-svg-icons";

export interface IComponentDataType {
  name: string,
  icon: IconProp,
  friendlyName: string,
  component?: (props: IComponentProps) => JSX.Element
}

export default class ComponentIndex {
  static ComponentDataTypes: Record<string, IComponentDataType> = {
    "page": {
      name: "page",
      icon: faFileAlt,
      friendlyName: "Page",
      component: PageComponent
    },
    "wiki": {
      name: "wiki",
      icon: faCopy,
      friendlyName: "Page Group",
      component: WikiComponent
    },
    "files": {
      name: "files",
      icon: faFolderOpen,
      friendlyName: "Files",
      component: FilesComponent
    },
    "forum": {
      name: "forum",
      icon: faComment,
      friendlyName: "Forum",
      component: ForumComponent
    },
    "chat": {
      name: "chat",
      icon: faCommentAlt,
      friendlyName: "Chat",
      component: ChatComponent
    }
  };

  static getComponent = function(id: string, type: string, planet: IPlanet, name: string, subId?: string, pageId?: string ): JSX.Element | undefined {
    const Component = ComponentIndex.ComponentDataTypes[type].component;
    if(Component) {
      return React.createElement(Component, {id, planet, name, subId, pageId});
    }
  }
}
