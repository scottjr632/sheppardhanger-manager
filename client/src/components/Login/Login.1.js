import React from "react";
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { NotificationManager } from 'react-notifications'

import { backend } from '../../backendts'

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
      stayLoggedIn: true,
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
    let { target } = event
    let value = target.type === 'checkbox' ? target.checked : target.value
    this.setState({
      [target.name]: value
    });
  };

  onSubmit = e => {
    e.preventDefault();
    let { email, password } = this.state
    if (this.validateForm()) {
      this.state.stayLoggedIn ?
      this.props.userStore.loginUserStay({ email, password }, (auth) => {
        if (auth) this.props.onLoginSuccess()
      }) :
      this.props.userStore.loginUser({ email, password }, (auth) => {
        if (auth) this.props.onLoginSuccess()
      })
    } else {
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
  }

  sendPasswordResetEmail = async () => {
    let res = await backend.password.sendResetPasswordEmail(this.state.email).catch(() => NotificationManager.error('Unable to send email. Please try again.'))
    if (res.statusText !== 'OK') {
      NotificationManager.error('Unable to send email. Please try again.')
      return
    } 

    NotificationManager.info('Reset password email sent. Please check email and spam.')
    this.setState({ left: true })
  }

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
          {!this.state.left ? 
          <div className={`authpage_body`}>
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
                <span><span className={'authpage_checkbox'}>Stay logged in<input type="checkbox" name="stayLoggedIn" onChange={this.handleChange} checked={this.state.stayLoggedIn} /></span></span>
              </form>
            </div>
          </div> : 
          <div className={`authpage_body`}>
            <h2>Set a new password</h2>
            <div className="authpage_field" style={{ marginBottom: '2px' }}>
              <input type="text" name="email" onChange={this.handleChange} label="Email" value={this.state.email} autoComplete={'false'} onBlur={()=>{this.emailFocused(false)}} onFocus={()=>{this.emailFocused(true)}}/>
              <label htmlFor="email" className={this.state.email.length > 0 || this.state.emailIsFocused? 'float' : ''}>Email</label>
            </div>
            <span style={{ fontSize: '12px' }}>A verification email will be sent to your inbox to confirm setting your new password.</span>
            <div style={{ textAlign: 'center' }}>
              <input type="submit" className="authpage_submit" value="Send Reset Email" onClick={this.sendPasswordResetEmail} style={{ marginBottom: '5px' }}/>
              <span><span><a href="#" className={'authpage_link'} onClick={this.toggleLeft}>Sign in instead</a></span></span>
            </div>
          </div>
          }
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
