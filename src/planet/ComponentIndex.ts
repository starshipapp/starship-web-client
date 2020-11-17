export interface IComponentDataType {
  name: string,
  // really dumb work around to allow icon rendering
  icon: "document" | "applications" | "folder-open" | "comment",
  friendlyName: string
}

export default class ComponentIndex {
  static ComponentDataTypes: Record<string, IComponentDataType> = {
    "page": {
      name: "page",
      icon: "document",
      friendlyName: "Page"
    },
    "wiki": {
      name: "wiki",
      icon: "applications",
      friendlyName: "Page Group"
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
}