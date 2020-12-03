
export enum reportObjectType {
  PLANET = 0,
  FORUMPOST = 1,
  FORUMREPLY = 2,
  FILE = 3
}

export const reportObjectTypeStrings = ["Planet", "Forum Post", "Forum Reply", "File"];

export enum reportType {
  HARASSMENT = 0,
  COPYRIGHT = 1,
  ILLEGAL = 2,
  SPAM = 3,
  MALWARE = 4,
  NSFW = 5,
}