import IComponentProps from "./components/IComponentProps";
import PageComponent from "./components/PageComponent";
import React from "react";
import IPlanet from "../types/IPlanet";
import WikiComponent from "./components/wikis/WikiComponent";
import ForumComponent from "./components/forums/ForumComponent";
import FilesComponent from "./components/files/FilesComponent";
import ChatComponent from "./components/chat/ChatComponent";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faComment, faCommentAlt, faCopy, faFileAlt, faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import Intent from "../components/Intent";
import Tag from "../components/display/Tag";

export enum ComponentQuality {
  UNIMPLEMENTED = 0,
  UNFINISHED = 1,
  ALPHA = 2,
  BETA = 3,
  RELEASE = 4,
}

export function getComponentQualityTag(quality: ComponentQuality): JSX.Element | undefined {
  const className = "mt-0.5 ml-2";

  switch (quality) {
    case ComponentQuality.UNIMPLEMENTED:
      return React.createElement(Tag, {className, intent: Intent.DANGER, children: "Unimplemented"});
    case ComponentQuality.UNFINISHED:
      return React.createElement(Tag, {className, intent: Intent.DANGER, children: "Unfinished"});
    case ComponentQuality.ALPHA:
      return React.createElement(Tag, {className, intent: Intent.WARNING, children: "Alpha"});
    case ComponentQuality.BETA:
      return React.createElement(Tag, {className, intent: Intent.SUCCESS, children: "Beta"});
  }
}

export interface IComponentDataType {
  name: string,
  icon: IconProp,
  friendlyName: string,
  component?: (props: IComponentProps) => JSX.Element
  quality: ComponentQuality
}

export default class ComponentIndex {
  static ComponentDataTypes: Record<string, IComponentDataType> = {
    "page": {
      name: "page",
      icon: faFileAlt,
      friendlyName: "Page",
      component: PageComponent,
      quality: ComponentQuality.BETA
    },
    "wiki": {
      name: "wiki",
      icon: faCopy,
      friendlyName: "Page Group",
      component: WikiComponent,
      quality: ComponentQuality.ALPHA
    },
    "files": {
      name: "files",
      icon: faFolderOpen,
      friendlyName: "Files",
      component: FilesComponent,
      quality: ComponentQuality.RELEASE
    },
    "forum": {
      name: "forum",
      icon: faComment,
      friendlyName: "Forum",
      component: ForumComponent,
      quality: ComponentQuality.BETA
    },
    "chat": {
      name: "chat",
      icon: faCommentAlt,
      friendlyName: "Chat",
      component: ChatComponent,
      quality: ComponentQuality.UNFINISHED
    }
  };

  static getComponent = function(id: string, type: string, planet: IPlanet, name: string, subId?: string, pageId?: string ): JSX.Element | undefined {
    const Component = ComponentIndex.ComponentDataTypes[type].component;
    if(Component) {
      return React.createElement(Component, {id, planet, name, subId, pageId});
    }
  }
}
