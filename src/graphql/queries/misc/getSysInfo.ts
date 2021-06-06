import gql from "graphql-tag";
import ISysInfo from "../../../types/ISysInfo";

export interface IGetSysInfoData {
  sysInfo: ISysInfo
}

const getSysInfo = gql`
  mutation SysInfo {
    sysInfo {
      serverName
      version
      schemaVersion
      supportedFeatures
      supportedComponents
      clientFlags
      paths {
        emojiURL
        pfpURL
        bannerURL
      }
    }
  }
`;

export default getSysInfo;