import { faCommentAlt, faCopy, faFolderOpen, faGlobe, faHome, faUser } from "@fortawesome/free-solid-svg-icons";
import Divider from "../../components/display/Divider";
import Textbox from "../../components/input/Textbox";
import MenuItem from "../../components/menu/MenuItem";

function LandingIntroduction(): JSX.Element {
  return (
    <div className="mt-12 mb-12 mx-auto w-3/4 flex flex-col">
      <div className="flex">
        <div className="my-auto w-full">
          <div className="font-extrabold text-4xl">
            Everything you need. All in one place.
          </div>
          <div className="mt-2 text-lg font-bold">
            Chat with your friends. Share files. Take notes.
          </div>
          <div className="mt-4 text-lg">
            Say goodbye to large info channels listing every social media platform you use. Stop sharing folders over email. Just add a new page, and you're done.
            No more clutter. No more wasted time. No more asking for emails. With Starship, it's all in one place.
          </div>
        </div>
        <div className="ml-10 rounded-lg overflow-hidden w-xl h-72 flex-shrink-0 bg-gray-800 shadow-lg pointer-events-none flex my-auto">
          <div className="bg-gray-700 h-full w-44 pt-2 pb-2 relative flex flex-col flex-shrink-0">
            <MenuItem
              icon={faGlobe}
            >ENG 120 Team 4</MenuItem>
            <Divider/>
            <MenuItem
              icon={faHome}
            >Home</MenuItem>
            <MenuItem
              icon={faCopy}
            >Notes</MenuItem>
            <MenuItem
              icon={faCommentAlt}
            >Chat</MenuItem>
            <MenuItem
              icon={faCommentAlt}
            >Group Project Chat</MenuItem>
            <MenuItem
              icon={faFolderOpen}
            >Project Files</MenuItem>
            <div className="mt-auto"/>
            <Divider/>
            <MenuItem
              icon={faUser}
            >Lemon</MenuItem>
          </div>
          <div className="w-full h-full flex flex-col p-4">
            <div className="mb-3 flex">
              <div className="w-10 h-10 mr-2 bg-blue-500 rounded-full"/>
              <div>
                <div className="font-bold">Sam</div>
                <div>did you upload the PDF yet?</div>
              </div>
            </div>
            <div className="mb-3 flex">
              <div className="w-10 h-10 mr-2 bg-yellow-300 rounded-full"/>
              <div>
                <div className="font-bold">Lemon</div>
                <div>Nope, not yet. It's in the project files right?</div>
              </div>
            </div>
            <div className="mb-3 flex">
              <div className="w-10 h-10 mr-2 bg-blue-500 rounded-full"/>
              <div>
                <div className="font-bold">Sam</div>
                <div>yeah, it should be</div>
              </div>
            </div>
            <div className="mb-3 flex">
              <div className="w-10 h-10 mr-2 bg-yellow-300 rounded-full"/>
              <div>
                <div className="font-bold">Lemon</div>
                <div>Yep, found it. Uploading now.</div>
              </div>
            </div>
            <Textbox
              large
              placeholder="Type a message..."
              className="mt-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingIntroduction;
