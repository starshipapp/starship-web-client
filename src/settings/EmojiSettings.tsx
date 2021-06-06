import IUser from "../types/IUser";

interface IEmojiSettingsProps {
  user: IUser
  refetch: () => void
}

function EmojiSettings(props: IEmojiSettingsProps): JSX.Element {
  return (
    <div className="Settings bp3-dark">
      <div className="Settings-container">
        <div className="Settings-page-header">
        Emojis
        </div>
        <div >

        </div>
      </div>
    </div>
  );
}

export default EmojiSettings;