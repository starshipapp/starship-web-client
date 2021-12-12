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

interface IAppProps {
  forcefullyResetLink: () => void;
}

function App(props: IAppProps): JSX.Element {
  return (
    <BrowserRouter>
      <div className="flex w-screen h-screen dark:bg-gray-900">
        <Toaster position="bottom-right"/>
        <Unsupported/>
        <Debug/>
        <Routes>
          <Route path="/login" element={<Login forcefullyResetLink={props.forcefullyResetLink}/>}/>
          <Route path="/forgot/:forgotdata" element={<Forgot/>}/>
          <Route path="/verify/:activationdata" element={<Activate/>}/>
          <Route path="/gadmin/*" element={<GAdmin/>}/>
          <Route path="/debug/components" element={<ComponentsTesting/>}/>
          <Route path="/debug/landingtest" element={<Landing/>}/>
          <Route path="/invite/:inviteId/*" element={<Invite/>}/>
          <Route path="/planet/:planet/*" element={<>
            <MainSidebar context="planet" forcefullyResetLink={props.forcefullyResetLink}/>
            <Planet/>
          </>}/>
          <Route path="/settings/*" element={<>
            <MainSidebar context="settings" forcefullyResetLink={props.forcefullyResetLink}/>
            <Settings/>
          </>}/>
          <Route path="/messages/*" element={<>
            <MainSidebar context="messages" forcefullyResetLink={props.forcefullyResetLink}/>
            <Messages/>
          </>}/>
          <Route path="/*" element={<>
            <MainSidebar context="home" forcefullyResetLink={props.forcefullyResetLink}/>
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/terms" element={<Terms/>}/>
              <Route path="/privacy" element={<Privacy/>}/>
              <Route path="/rules" element={<Rules/>}/>
            </Routes>
          </>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
