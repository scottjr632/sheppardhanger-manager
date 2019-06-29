import React from 'react'

import { NotificationManager } from 'react-notifications'

import ConfirmButton from '../Buttons/confirm.jsx'
import * as backend from '../../backend'

const btnCreateStyle = {
    backgroundColor: '#128de9'
}

const inputStyle = {
    width: '85%',
    float: 'normal'
}

const labelStyle = {
    width: '100%'
}
  
const spanStyle = {
    display: 'flex'
}
  
const btnSpanStyle = {
    ...spanStyle,
    justifyContent: 'space-between',
    marginTop: '30px'
}
  
const errorSpanStyle = {
    display: 'inline-block',
    fontWeight: 'bold',
    alignSelf: 'center',
    color: 'white',
    fontSize: '7pt',
    width: '85%',
    backgroundColor: '#d65956',
    padding: '5px 10px',
    borderRadius: '3px',
    margin: '5px 20px',
    float: 'right',
  }

class NewUser extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            password: '',
            password2: '',
        }
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
        return this.state.firstName.length > 0 &&
               this.state.lastName.length > 0 &&
               this.validateEmail(this.state.email) &&
               this.validatePassword1(this.state.password1) &&
               this.validatePassword2(this.state.password2)
        }
    
      createUser = () => {
        if (this.validateForm()) {
          let data = {
            email: this.state.email, 
            fname: this.state.firstName,
            lname: this.state.lastName,
            password: this.state.password1
          }
          backend.createNewUser(data, res => {
            if (res.statusText !== 'CREATED') {
              NotificationManager.error('Something went wrong')
              console.log(res)
              return
            }
          })
          NotificationManager.info('Create new user')
          this.setState({ email: '', firstName: '', lastName: '', password1: '', password2: '' })
          this.props.toggleAdmin()
          return
        }
    
        NotificationManager.error('Please make sure form is filled out correcly')
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

    render() {
        let { emailError, pass1Error, pass2Error } = this.state
        return(
            <div style={{margin: '10px 5%', border: '1pt solid black', borderRadius: '3px', padding: '10px'}}>
            <span><h4>Create New Sheppard Hanger MANAGER</h4></span>
            <form>
              <span style={spanStyle}>
                <div className={'input-group'}>
                  <label style={labelStyle}>First name</label><input style={inputStyle} name={'firstName'} autoFocus={true} onChange={this.handleWithValidate} value={this.state.firstName}/></div>
                <div className={'input-group'}><label style={labelStyle}>Last name</label><input style={inputStyle} name={'lastName'} onChange={this.handleWithValidate} value={this.state.lastName}/></div>
                <div className={'input-group'}>
                  <label style={labelStyle}>Email</label>
                  <input style={inputStyle} name={'email'} autoComplete={'username'} name={'email'} onChange={this.handleWithValidate} value={this.state.email}/>
                  {emailError && <span style={errorSpanStyle}>Must be a valid email</span>}
                </div>
              </span>
              <span style={spanStyle}>
                <div className={'input-group'}>
                  <label style={labelStyle}>Password</label>
                  <input style={inputStyle} type={'password'} autoComplete={'new-password'} name={'password1'} onChange={this.handleWithValidate} value={this.state.password1}/>
                  {pass1Error && <span style={errorSpanStyle}>Password must contain 1 lowercase, 1 uppercase, 1 numeric, and be at least 8 characters</span> }
                </div>
                <div className={'input-group'}>
                  <label style={labelStyle}>Confirm password</label>
                  <input style={inputStyle} type={'password'} name={'password2'} onChange={this.handleWithValidate} value={this.state.password2}/>
                  {pass2Error && <span style={errorSpanStyle}>Passwords must match</span>}
                </div>
              </span>
            </form>
            <span style={btnSpanStyle}>
              <ConfirmButton removeMessage={'Cancel'} confirmAction={this.props.toggleAdmin}/>         
              <ConfirmButton removeMessage={'Create user'} style={btnCreateStyle} confirmAction={this.createUser}/>
            </span>
        </div>
        )
    }
}

export default NewUser