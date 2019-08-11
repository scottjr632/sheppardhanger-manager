import React from 'react'

import { NotificationManager } from 'react-notifications'
import { backend } from '../../backendts';

interface state {
  email: string
  password: string
  passwordIsFocused: Boolean
  passwordConfirm: string
  passwordConfirmIsFocused: Boolean
  token: string
  tokenIsValid: Boolean
  errorMsg: string
}

interface props {
  history: Array<string>
}

class ResetPassword extends React.Component<props, state> {

  state = {
    email: '',
    password: 'string',
    passwordIsFocused: false,
    passwordConfirm: 'string',
    passwordConfirmIsFocused: false,
    token: 'string',
    tokenIsValid: false,
    errorMsg: ''
  }

  componentWillMount() {
    let queries = this.parseQueryString()
    backend.password.checkIfValidResetToken(queries.token).then(() => {
      this.setState({ tokenIsValid: true, email: queries.user, token: queries.token })
    }).catch(() => {
      this.setState({ tokenIsValid: false, errorMsg: 'Token is invalid' })
    })
  }

  parseQueryString = (): any => {
    let str = window.location.search;
    let objURL = {};

    str.replace(
        new RegExp( "([^?=&]+)(=([^&]*))?", "g" ),
        function( $0, $1, $2, $3 ){
            objURL[ $1 ] = $3;
            return $3
        }
    )
    return objURL
  }

  passwordFocused = (passwordIsFocused: Boolean) => { this.setState({ passwordIsFocused }) }
  passwordConfirmFocused = (passwordConfirmIsFocused: Boolean) => { this.setState({ passwordConfirmIsFocused }) }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let { target } = event
    
    this.setState(prevState => ({
      ...prevState,
      [target.name]: target.value
    }))
  }

  goToLogin = () => {
    this.props.history.push('/login')
  }

  onSubmit = async (event: React.MouseEvent) => {
    event.preventDefault()

    let { token, password, passwordConfirm } = this.state
    console.log(password, passwordConfirm)
    if (password.length < 16) {
      NotificationManager.error('Password must be 16 or more characters.')
      return
    } else if (password !== passwordConfirm) {
      NotificationManager.error('Passwords must match.')
      return
    } 

    backend.password.resetPassword(token, passwordConfirm)
      .then(() => { NotificationManager.info('Password reset. Please log in'); this.goToLogin() })
      .catch(() => NotificationManager.error('Something went wrong on the server. Unable to reset password'))
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
          {this.state.tokenIsValid ? 
          <div className={`authpage_body`}>
            <h2>Please reset your password</h2>
            <div>
              <form>
                <div className="authpage_field">
                  <input type="text" name="email" value={this.state.email} autoComplete={'false'} disabled={true}/>
                  <label htmlFor="email" className={'float'}>Email</label>
                </div>
                <div className="authpage_field">
                  <input type="password" name="password" onChange={this.handleChange} value={this.state.password} autoComplete={'false'} onBlur={()=>{this.passwordFocused(false)}} onFocus={()=>{this.passwordFocused(true)}}/>
                  <label htmlFor="password" className={this.state.password.length > 0 || this.state.passwordIsFocused ? 'float' : ''}>Password</label>
                </div>
                <div className="authpage_field">
                  <input type="password" name="passwordConfirm" onChange={this.handleChange} value={this.state.passwordConfirm} autoComplete={'false'} onBlur={()=>{this.passwordConfirmFocused(false)}} onFocus={()=>{this.passwordConfirmFocused(true)}}/>
                  <label htmlFor="passwordConfirm" className={this.state.password.length > 0 || this.state.passwordIsFocused ? 'float' : ''}>Confirm Password</label>
                </div>
              </form>
              <div style={{ textAlign: 'center' }}>
                <input className="authpage_submit" value="Reset password" onClick={this.onSubmit} style={{ marginBottom: '5px' }}/>
                <span><span><a href="#" className={'authpage_link'} onClick={this.goToLogin}>Sign in instead</a></span></span>
              </div>
            </div>
          </div> : 
          <div className={`authpage_body`}>
            <h2>{this.state.errorMsg}</h2>
            <h4>Please go back to the login page to request a new email.</h4>
            <div style={{ textAlign: 'center' }}>
              <span><span><a href="#" className={'authpage_link'} onClick={this.goToLogin}>Go to login page</a></span></span>
            </div>
          </div>}
        </div>
      </div>
    );
  }
}

export default ResetPassword