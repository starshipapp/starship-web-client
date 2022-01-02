/* eslint-disable semi */

export default interface ISysInfo {
  serverName: string,
  version: string,
  schemaVersion: string,
  supportedFeatures: string[],
  supportedComponents: string[],
  clientFlags: string[],
  paths: {
    emojiURL?: string
    pfpURL?: string
    bannerURL?: string
    graphQLEndpoint: string
  }
}