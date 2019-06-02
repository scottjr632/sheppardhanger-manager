import React from 'react'

import { NotificationManager } from 'react-notifications'

const displayStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end'
}

const resetStyle = {
  position: 'absolute',
  top: '45px',
  maxWidth: '324px',
  right: '5px',
  zIndex: 1,
  overflow: 'auto',
  overflowX: 'hidden',
  maxHeight: '265px'
}

const inputStyle = {
  backgroundColor: 'rgba(0,0,0,0)',
  width: '90%',
  minWidth: '280px'
}

const btnStyle = {
  maxWidth: '300px'
}

class ResetPassword extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  validateEmail = (email) => {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  validatePassword1 = (password) => {
    let re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/
    return re.test(String(password))
  }

  validatePassword2 = (password2) => {
    return password2 === this.state.password1
  }

  validateForm = () => {
    return this.validateEmail(this.state.email) &&
           this.validatePassword1(this.state.password1) &&
           this.validatePassword2(this.state.password2)
  }

  handleWithValidate = (event) => {
    let { target } = event
    switch(target.name) {
    case 'email':
      this.setState({
        emailError: !this.validateEmail(target.value),
        email: target.value
      })
      break
    case 'password1':
      this.setState({
        pass1Error: !this.validatePassword1(target.value),
        password1: target.value
      })
      break
    case 'password2':
      this.setState({
        pass2Error: !this.validatePassword2(target.value),
        password2: target.value
      })
      break
    default:
      this.setState({
        [target.name]: target.value
      })
      break
    }
  }

  doPasswordReset = (event) => {
    event.preventDefault()
    if (this.validateForm()) {
      NotificationManager.info('Password reset email sent. Please check you email!')
      this.setState({
        email: '',
        password1: '',
        password2: ''
      })
    } else {
      NotificationManager.error('Please fill out form properly')
    } 
  }

  render(){
    return(
      <div style={resetStyle}>
        <form style={displayStyle}>

          <div className={'input-group'}>
            <label htmlFor={'email'}>ENTER YOUR EMAIL</label>
            <input name={'email'} style={inputStyle} value={this.state.email} onChange={this.handleWithValidate} autoComplete={'email'}/>
            {this.state.emailError && <span className={'error-span'}>Please enter a valid email</span>}
          </div>

          <div className={'input-group'}>
            <label htmlFor={'password1'}>ENTER NEW PASSWORD</label>
            <input name={'password1'} style={inputStyle} value={this.state.password} onChange={this.handleWithValidate} type={'password'}/>
            {this.state.pass1Error && <span className={'error-span'}>Password must contain 1 lowercase, 1 uppercase, 1 numeric, and be at least 8 characters</span>}

          </div>

          <div className={'input-group'}>
            <label htmlFor={'password2'}>CONFIRM PASSWORD</label>
            <input name={'password2'} style={inputStyle} value={this.state.password2} onChange={this.handleWithValidate} type={'password'}/>
            {this.state.pass2Error && <span className={'error-span'}>Passwords must match</span>}
          </div>

          <button className={'submit'} style={{alignSelf: 'center'}} onClick={this.doPasswordReset}><span>Reset Password</span></button>
        </form>
      </div>
    )
  }

}

export default ResetPassword