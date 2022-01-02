import gql from "graphql-tag";
import IUser from "../../../types/IUser";

export interface ISetNotificationSettingData {
  setNotificationSetting: IUser
}

const setNotificationSettingMutation = gql`
  mutation SetNotificationSetting($option: Int!) {
    setNotificationSetting(option: $option) {
      id
      notificationSetting
    }
  }
`;

export default setNotificationSettingMutation;