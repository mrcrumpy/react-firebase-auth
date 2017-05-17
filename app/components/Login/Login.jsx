import React from 'react';
import { bool, shape, string } from 'prop-types';
import {
  Link,
  Redirect,
} from 'react-router-dom';
import firebaseUtils from '../../utils/firebaseUtils';

class Login extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleGoogle = this.handleGoogle.bind(this);

    this.state = {
      error: false,
      redirectToReferrer: false,
    };
  }
  componentWillMount() {
  }
  handleSubmit(e) {
    e.preventDefault();
    const email = this.email.value;
    const pw = this.pw.value;
    firebaseUtils.loginWithPW({ email, password: pw }, (err) => {
      if (!err) {
        this.setState({ redirectToReferrer: true });
      } else {
        this.setState({ error: err });
      }
    });
  }
  handleGoogle(e) {
    e.preventDefault();
    firebaseUtils.loginWithGoogle((err) => {
      if (!err) {
        this.setState({ redirectToReferrer: true });
      } else {
        this.setState({ error: err });
      }
    });
  }
  handleFacebook(e) {
    e.preventDefault();

    firebaseUtils.loginWithFacebook((err) => {
      if (!err) {
        this.setState({ redirectToReferrer: true });
      } else {
        this.setState({ error: err });
      }
    });
  }
  render() {
    if (this.props.authed === true) return <Redirect to="/" />;
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return (
        <Redirect to={from} />
      );
    }

    const errors = this.state.error ? <p> {this.state.error} </p> : '';
    return (
      <div className="grid-block align-center v-align">
        <div className="grid-content small-12 medium-8 large-6 align-center">
          <h1 className="small-12"> Einloggen </h1>
          <p>Du hast noch kein Konto?</p>
          <Link to="/register">Jetzt registrieren</Link>
          <div className="grid-block">
            <div className="small-6 grid-content">
              <button className="form-submit" onClick={this.handleGoogle}>Mit Google einloggen</button>
            </div>
            <div className="small-6 grid-content text-right">
              <button className="form-submit" onClick={this.handleFacebook}>Mit Facebook einloggen</button>
            </div>
          </div>

          <form className="small-12" onSubmit={this.handleSubmit}>
            <input ref={(c) => { this.email = c; }} type="text" placeholder="Email" />
            <input ref={(c) => { this.pw = c; }} type="password" placeholder="Password" />
            <button type="submit" className="form-submit float-right">Einloggen</button>
            {errors}
          </form>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  authed: bool,
  location: shape({
    pathname: string,
    state: shape({
      from: string,
    }),
  }),
};

Login.defaultProps = {
  authed: false,
  location: {},
};

Login.contextTypes = {
};

export default Login;
