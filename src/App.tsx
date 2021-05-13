import { Switch, Route, Router } from 'react-router-dom';
import React from 'react';
import './css/App.css';
import { createBrowserHistory } from "history";
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

const history = createBrowserHistory();

interface IAppProps {
  forcefullyResetLink: () => void;
}

function App(props: IAppProps): JSX.Element {
  return (
    <Router history={history}>
      <div className="App bp3-dark">
        <Switch>
          <Route path="/gadmin">
            <GAdmin/>
          </Route>
          <Route>
            <Unsupported/>
            <MainSidebar forcefullyResetLink={props.forcefullyResetLink}/>
            <Switch>
              <Route path="/login">
                <Login forcefullyResetLink={props.forcefullyResetLink}/>
              </Route>
              <Route path="/planet/:planet">
                <Planet home={true}/>
              </Route>
              <Route path="/planet/:planet/:component">
                <Planet home={false}/>
              </Route>
              <Route path="/invite/:inviteId">
                <Invite/>
              </Route>
              <Route path="/terms">
                <Terms/>
              </Route>
              <Route path="/privacy">
                <Privacy/>
              </Route>
              <Route path="/rules">
                <Rules/>
              </Route>
              <Route path="/forgot/:forgotdata">
                <Forgot/>
              </Route>
              <Route path="/verify/:activationdata">
                <Activate/>
              </Route>
              <Route path="/settings">
                <Settings/>
              </Route>
              <Route path="/">
                <Home/>
              </Route>
            </Switch>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
