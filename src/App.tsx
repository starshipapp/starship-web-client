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

const history = createBrowserHistory();

function App(): JSX.Element {
  return (
    <Router history={history}>
      <div className="App bp3-dark">
        <Unsupported/>
        <MainSidebar />
        <Switch>
          <Route path="/login">
            <Login/>
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
          <Route path="/">
            <Home/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
