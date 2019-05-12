import React from "react";
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { NotificationManager } from 'react-notifications'

@inject('userStore')
@observer
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      loginPending: false,
      loginError: this.props.userStore.loginError,
      passwordLengthReq: this.props.passwordLengthReq || 6,
      emailLengthReq: this.props.emailLengthReq || 5,
      showResetPassword: this.props.showResetPassword || true
    };
  }


  validateForm() {
    return this.state.email.length > this.state.emailLengthReq &&
      this.state.password.length > this.state.passwordLengthReq;
  }

  validatePassword() {
    const length = this.state.password.length;
    if (length > this.state.passwordLengthReq) return "success";
    else if (length > (this.state.passwordLengthReq / 2)) return "warning";
    else if (length > 0) return "error";
    return null;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  onSubmit = e => {
    e.preventDefault();
    let { email, password } = this.state
    if (this.validateForm()) {
      this.props.userStore.loginUser({ email, password }, (auth) => {
        if (auth) this.props.onLoginSuccess()
      })
    }
    else {
      if (this.state.email.length < this.state.emailLengthReq) NotificationManager.warning(
        `Email length needs to be more than ${this.state.emailLengthReq} characters`)
      if (this.state.password.length < this.state.passwordLengthReq) NotificationManager.warning(
        `Password length needs to be more than ${this.state.passwordLengthReq}`
      )

      return
    }
    this.setState({
      email: "",
      password: "",
      loginPending: true
    });
  };

  render() {
    return (
      <div className="container">
        <div className="grid login-container">
          {this.state.loginPending && !this.props.userStore.loginError && "Signing you in..."}
          <form method="POST" className="form login" onSubmit={this.onSubmit}>
            <div className="form__field">
              <label htmlFor="login__username">
                <i className="fas fa-user" />
                <span className="hidden">Username</span>
              </label>
              <input
                id="email"
                value={this.state.email}
                onChange={this.handleChange}
                type="text"
                name="username"
                className="form__input"
                placeholder="Username"
                required
              />
            </div>

            <div className="form__field">
              <label htmlFor="login__password">
                <i className="fas fa-lock" />
                <span className="hidden">Password</span>
              </label>
              <input
                id="password"
                value={this.state.password}
                onChange={this.handleChange}
                type="password"
                name="password"
                className={"form__input validate " + this.validatePassword() }
                placeholder="Password"
                required
              />
            </div>

            <div className="form__field">
              <input type="submit" value="Sign In" disabled={!this.validateForm()} style={!this.validateForm() ? {backgroundColor: '#e68fb0'} : {backgroundColor: '#ea4c88'}}/>
            </div>
          </form>
          { this.props.showNotAMember &&
            <p className="text--center">
              Not a member?{ " " }
              <a className="subdued-link" href="#">
                Sign up now
              </a>{ " " }
              <svg className="icon"/>
            </p>
          }
          { this.state.showResetPassword &&
          <p className="text--center">
            Forgot your password?{ " " }
            <a className="subdued-link" href="#">
              Click to reset
            </a>{ " " }
            <svg className="icon"/>
          </p>
          }
        </div>

        <svg xmlns="http://www.w3.org/2000/svg" className="icons">
          <symbol id="arrow-right" viewBox="0 0 1792 1792">
            <path d="M1600 960q0 54-37 91l-651 651q-39 37-91 37-51 0-90-37l-75-75q-38-38-38-91t38-91l293-293H245q-52 0-84.5-37.5T128 1024V896q0-53 32.5-90.5T245 768h704L656 474q-38-36-38-90t38-90l75-75q38-38 90-38 53 0 91 38l651 651q37 35 37 90z" />
          </symbol>
          <symbol id="lock" viewBox="0 0 1792 1792">
            <path d="M640 768h512V576q0-106-75-181t-181-75-181 75-75 181v192zm832 96v576q0 40-28 68t-68 28H416q-40 0-68-28t-28-68V864q0-40 28-68t68-28h32V576q0-184 132-316t316-132 316 132 132 316v192h32q40 0 68 28t28 68z" />
          </symbol>
          <symbol id="user" viewBox="0 0 1792 1792">
            <path d="M1600 1405q0 120-73 189.5t-194 69.5H459q-121 0-194-69.5T192 1405q0-53 3.5-103.5t14-109T236 1084t43-97.5 62-81 85.5-53.5T538 832q9 0 42 21.5t74.5 48 108 48T896 971t133.5-21.5 108-48 74.5-48 42-21.5q61 0 111.5 20t85.5 53.5 62 81 43 97.5 26.5 108.5 14 109 3.5 103.5zm-320-893q0 159-112.5 271.5T896 896 624.5 783.5 512 512t112.5-271.5T896 128t271.5 112.5T1280 512z" />
          </symbol>
        </svg>
      </div>
    );
  }
}

Login.propTypes = {
  showNotAMember: PropTypes.bool,
  passwordLengthReq: PropTypes.number,
  emailLengthReq: PropTypes.number,
  onLoginSuccess: PropTypes.func
}

export default Login;
