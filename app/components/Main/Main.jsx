import React from 'react';

import {
  Route,
  Switch,
} from 'react-router';

import firebaseUtils from '../../utils/firebaseUtils';
import PrivateRoute from '../../utils/authenticated';

import Dashboard from '../Dashboard/Dashboard';
import Login from '../Login/Login';
import Logout from '../Login/Logout';
import Register from '../Login/Register';



class Main extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      loggedIn: false,
      currentUser: null,
      receivedData: false,
    };
  }

  componentWillMount() {
    firebaseUtils.onChange = () => {
      this.setState({
        loggedIn: false,
      });
    };
    firebaseUtils.isLoggedIn((loggedIn, currentUser) => {
      this.setState({
        loggedIn,
        currentUser,
        receivedData: true,
      });
    });
  }
  render() {
    if (this.state.receivedData === false) {
      return false;
    }
    return (
      <div>
          <Switch>
            <PrivateRoute exact path="/" authed={this.state.loggedIn} component={Dashboard} user={this.state.currentUser} setMessage={this.setMessage} sidebar={this.state.sidebar} setSidebarLeft={this.handleSwipeRight} setSidebarRight={this.handleSwipeLeft} />
            <Route path="/login" render={() => <Login authed={this.state.loggedIn} />} />
            <Route path="/register" component={Register} />
            <Route path="/logout" component={Logout} />
          </Switch>
      </div>
    );
  }
}

Main.propTypes = {
};

export default Main;
