import React from 'react';

import firebaseUtils from '../../utils/firebaseUtils';


class Register extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      error: false,
    };
  }
  handleSubmit(e) {
    e.preventDefault();
    const email = this.email.value;
    const pw = this.pw.value;
    const prename = this.prename.value;
    const name = this.name.value;
    firebaseUtils.createUser({ name: `${prename} ${name}`, email, password: pw }, (err) => {
      if (!err) {
        this.context.router.replace('/');
      } else {
        this.setState({ error: err });
      }
    });
  }
  render() {
    const errors = this.state.error ? <p> {this.state.error} </p> : '';
    return (
      <div className="grid-block align-center v-align">
        <div className="grid-content small-12 medium-8 large-6 align-center">
          <h1> Register </h1>
          <p>Du hast schon ein CookSpace Konto?</p>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="vorname"> Vorname </label>
              <input id="vorname" type="text" className="form-control" ref={(c) => { this.prename = c; }} placeholder="Vorname" required />
            </div>
            <div className="form-group">
              <label htmlFor="nachname"> Nachname </label>
              <input id="nachname" type="text" className="form-control" ref={(c) => { this.name = c; }} placeholder="Nachname" required />
            </div>
            <div className="form-group">
              <label htmlFor="email"> Email </label>
              <input id="email" type="text" className="form-control" ref={(c) => { this.email = c; }} placeholder="Email" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input id="password" ref={(c) => { this.pw = c; }} type="password" className="form-control" placeholder="Password" required />
            </div>
            {errors}
            <button type="submit" className="form-submit float-right">Register</button>
          </form>
        </div>
      </div>
    );
  }
}

export default Register;
