import IComponentProps from "./components/IComponentProps";
import PageComponent from "./components/PageComponent";
import React from "react";
import IPlanet from "../types/IPlanet";
import WikiComponent from "./components/wikis/WikiComponent";

export interface IComponentDataType {
  name: string,
  // really dumb work around to allow icon rendering
  icon: "document" | "applications" | "folder-open" | "comment",
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
      friendlyName: "Files"
    },
    "forum": {
      name: "forum",
      icon: "comment",
      friendlyName: "Forum"
    }
  };

  static getComponent = function(id: string, type: string, planet: IPlanet, name: string, subId?: string, pageId?: string ): JSX.Element | undefined {
    const Component = ComponentIndex.ComponentDataTypes[type].component;
    if(Component) {
      return React.createElement(Component, {id, planet, name, subId, pageId});
    }
  }
}