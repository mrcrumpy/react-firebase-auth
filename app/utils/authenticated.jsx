import React from 'react';
import { Redirect, Route } from 'react-router';

function PrivateRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        return authed ? <Component {...props} {...rest} />
      : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
;
      }
    }
    />
  );
}

export default PrivateRoute;
