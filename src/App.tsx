import { Switch, Route, Router } from 'react-router-dom';
import React from 'react';
import './css/App.css';
import { createBrowserHistory } from "history";
import Home from './home/Home';
import MainSidebar from './sidebar/MainSidebar';
import Login from './login/Login';

const history = createBrowserHistory();

function App(): JSX.Element {
  return (
    <Router history={history}>
      <div className="App bp3-dark">
        <MainSidebar />
        <Switch>
          <Route path="/login">
            <Login/>
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
