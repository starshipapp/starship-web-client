import IComponentProps from "./components/IComponentProps";
import PageComponent from "./components/PageComponent";
import React from "react";
import IPlanet from "../types/IPlanet";
import WikiComponent from "./components/wikis/WikiComponent";
import ForumComponent from "./components/forums/ForumComponent";
import FilesComponent from "./components/files/FilesComponent";
import {IconName} from "@blueprintjs/core";
import ChatComponent from "./components/chat/ChatComponent";

export interface IComponentDataType {
  name: string,
  icon: IconName,
  friendlyName: string,
  component?: (props: IComponentProps) => JSX.Element
}

export default class ComponentIndex {
  static ComponentDataTypes: Record<string, IComponentDataType> = {
    "page": {
      name: "page",
      icon: "document",
      friendlyName: "Page",
      component: PageComponent
    },
    "wiki": {
      name: "wiki",
      icon: "applications",
      friendlyName: "Page Group",
      component: WikiComponent
    },
    "files": {
      name: "files",
      icon: "folder-open",
      friendlyName: "Files",
      component: FilesComponent
    },
    "forum": {
      name: "forum",
      icon: "comment",
      friendlyName: "Forum",
      component: ForumComponent
    },
    "chat": {
      name: "chat",
      icon: "chat",
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
