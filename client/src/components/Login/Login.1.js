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
      left: false,
      emailIsFocused: false,
      passwordIsFocused: false,
      loginError: this.props.userStore.loginError,
      passwordLengthReq: this.props.passwordLengthReq || 6,
      emailLengthReq: this.props.emailLengthReq || 5,
      showResetPassword: this.props.showResetPassword || true
    };
  }

  emailFocused = (emailIsFocused) => {
    this.setState({emailIsFocused})
  }

  passwordFocused = (passwordIsFocused) => {
    this.setState({passwordIsFocused})
  }

  toggleLeft = () => {
    this.setState({left: !this.state.left})
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
      [event.target.name]: event.target.value
    });
  };

  onSubmit = e => {
    e.preventDefault();
    console.log(this.props)
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
      <div className="authpage_modal">
        <div className="authpage_modal-blur"></div>
        <div className="authpage_modal-content">
          <div className="authpage_modal-header">
            <div>
              <h4>The Sheppard Hanger</h4>
              <h3>MANAGER</h3>
            </div>
          </div>
          <div className={`authpage_body ${this.state.left ? 'left' : ''}`}>
            <h2>Sign in</h2>
            <div>
              <form _lpchecked="1" autocomplete="off">
                <div className="authpage_field">
                  <input type="text" name="email" onChange={this.handleChange} label="Username" value={this.state.email} autoComplete={'false'} onBlur={()=>{this.emailFocused(false)}} onFocus={()=>{this.emailFocused(true)}}/>
                  <label htmlFor="email" className={this.state.email.length > 0 || this.state.emailIsFocused? 'float' : ''}>Username</label>
                </div>
                <div className="authpage_field">
                  <input type="password" name="password" onChange={this.handleChange} label="Password" value={this.state.password} autoComplete={'false'} onBlur={()=>{this.passwordFocused(false)}} onFocus={()=>{this.passwordFocused(true)}}/>
                  <label htmlFor="password" className={this.state.password.length > 0 || this.state.passwordIsFocused ? 'float' : ''}>Password</label>
                </div>
                <span><span>Not sure of your password?<a href="#" className={'authpage_link'} onClick={this.toggleLeft}>Set a new one</a></span></span>
                <input type="submit" className="authpage_submit" value="Sign in" onClick={this.onSubmit}/>
              </form>
            </div>
          </div>
        </div>
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
