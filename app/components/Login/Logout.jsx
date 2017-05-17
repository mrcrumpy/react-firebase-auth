import React from 'react';
import { Redirect } from 'react-router';

import firebaseUtils from '../../utils/firebaseUtils';


class Logout extends React.Component {
  componentWillMount() {
    firebaseUtils.logout();
  }
  render() {
    return <Redirect to={{ pathname: '/login', state: { message: 'you are now logged out!' } }} />;
  }
}
export default Logout;
