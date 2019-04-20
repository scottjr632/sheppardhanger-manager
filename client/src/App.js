import React, { Component } from 'react';
import {
  BrowserRouter as Router, 
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

import asyncComponent from './utils/AsyncComponent';

const Login = asyncComponent(() =>
  import('./pages/login.jsx').then(module => module.default)
)

// const Dashboard = asyncComponent(() =>
//   import('./pages/dashboard.jsx').then(module => module.default)
// )


const NotFound = asyncComponent(() =>
  import('./pages/notFound.jsx').then(module => module.default)
)

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    localStorage.getItem('access_token') !== null
      ? <Component {...props} />
      : <Redirect to='/login' />
  )} />
)

class App extends Component {

  render() {
    return (
      <Router>
        <div className="App">
            <section>
              <Switch>
                <Route exact path='/login' component={ Login } />
                <Route exact path='/' component={ Login } />
                <Route name="not-found" path='*' component={ NotFound } />
              </Switch>
            </section>
        </div>
      </Router>
      
    );
  }
}

export default App;
