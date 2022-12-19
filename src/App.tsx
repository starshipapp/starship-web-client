import { Routes, Route, BrowserRouter } from 'react-router-dom';
import './css/App.css';
import Home from './home/Home';
import MainSidebar from './sidebar/MainSidebar';
import Login from './login/Login';
import Planet from './planet/Planet';
import Invite from './invites/Invite';
import Terms from './legal/Terms';
import Privacy from './legal/Privacy';
import Rules from './legal/Rules';
import Unsupported from './Unsupported';
import Forgot from './login/Forgot';
import GAdmin from './gadmin/GAdmin';
import Settings from './settings/Settings';
import Activate from './login/Activate';
import Messages from './messages/Messages';
import ComponentsTesting from './components/ComponentsTesting';
import { Toaster } from 'react-hot-toast';
import Debug from "./debugger/Debug";
import Landing from './home/landing/Landing';
import { useState } from 'react';
import Button from './components/controls/Button';
import { faBars } from '@fortawesome/free-solid-svg-icons';

interface IAppProps {
  forcefullyResetLink: () => void;
}

function App(props: IAppProps): JSX.Element {
  const [showSidebar, setShowSidebar] = useState(false);
  
  const hide = () => {
    setShowSidebar(false);
  };
  
  return (
    <BrowserRouter>
      <div className="flex w-screen h-screen overflow-hidden flex-col" id="root">
        <div className="flex w-screen h-full flex-shrink overflow-hidden dark:bg-gray-900">
          <Toaster position="bottom-right"/>
          <Unsupported/>
          <Debug/>
          <Routes>
            <Route path="/login" element={<Login forcefullyResetLink={props.forcefullyResetLink}/>}/>
            <Route path="/forgot/:forgotdata" element={<Forgot/>}/>
            <Route path="/verify/:activationdata" element={<Activate/>}/>
            <Route path="/debug/components" element={<ComponentsTesting/>}/>
            <Route path="/debug/landingtest" element={<Landing/>}/>
            <Route path="/invite/:inviteId/*" element={<Invite/>}/>
            <Route path="/gadmin/*" element={<>
              <MainSidebar context="gadmin" forcefullyResetLink={props.forcefullyResetLink} hide={hide} hidden={!showSidebar}/>
              <GAdmin/>
            </>}/>
            <Route path="/planet/:planet/*" element={<>
              <MainSidebar context="planet" forcefullyResetLink={props.forcefullyResetLink} hide={hide} hidden={!showSidebar}/>
              <Planet/>
            </>}/>
            <Route path="/settings/*" element={<>
              <MainSidebar context="settings" forcefullyResetLink={props.forcefullyResetLink} hide={hide} hidden={!showSidebar}/>
              <Settings/>
            </>}/>
            <Route path="/messages/*" element={<>
              <MainSidebar context="messages" forcefullyResetLink={props.forcefullyResetLink} hide={hide} hidden={!showSidebar}/>
              <Messages/>
            </>}/>
            <Route path="/*" element={<>
              <MainSidebar context="home" forcefullyResetLink={props.forcefullyResetLink} hide={hide} hidden={!showSidebar}/>
              <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/terms" element={<Terms/>}/>
                <Route path="/privacy" element={<Privacy/>}/>
                <Route path="/rules" element={<Rules/>}/>
              </Routes>
            </>}/>
          </Routes>
        </div>
        <div className="flex flex-shrink-0 h-13 p-2.5 border-t z-20 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 w-full z-10 text-white font-extrabold md:hidden">
          <Button icon={faBars} className="mr-2" small minimal onClick={() => setShowSidebar(true)}/>
          <div className="mt-1">
            Starship
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
