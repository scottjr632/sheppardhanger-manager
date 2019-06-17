import React from 'react'
import PropTypes from 'prop-types'

import Modal from 'react-modal'
import { inject, observer } from 'mobx-react';

import PreferencesNav from '../Misc/PreferencesNav.jsx';
import ConfirmButton from '../Buttons/confirm.jsx';
import { validatePassword1 } from '../../utils'
import { EMAILPREFS } from '../../constants'
import { NotificationManager } from 'react-notifications'
import { updateUserPreferences, updateUserPassword } from '../../backend'

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

const customStyles = {
  content : {
    top: '100px',
    left: '100px',
    right: '100px',
    bottom: '100px',
    padding: '0'
  },
  overlay : {
    zIndex: 99
  }
};

const navTabs = {
  'GENERAL': 'General',
  'ACCOUNT': 'Account'
}

@inject('userStore')
@observer
class UserPreferences extends React.Component {

  constructor(props) {
    super(props);
    let { userStore } = this.props
    let { preferences } =  userStore
    this.state = {
      activeTab: navTabs.GENERAL,
      preferences: preferences,
      emailStyle: preferences.emailStyle || '',
      errors: {
        pass1Error: false,
        pass2Error: false
      }
    }
  }

  componentWillRecieveProps(nextProps) {
    if (nextProps.userStore.preferences !== this.state.preferences) {
      this.setState({ 
        preferences: nextProps.userStore.preferences,
        emailStyle: nextProps.userStore.preferences.emailStyle 
      })
    }
  }

  changeActiveTab = (activeTab) => {    
    this.setState({ activeTab })
  }

  buildPreferencesFromState = () => {
    return {
      emailStyle: this.state.emailStyle
    }
  }

  resetPassword = () => {
    if (validatePassword1(this.state.password) && 
        this.state.password === this.state.password2) {
      updateUserPassword(this.state.password)
      NotificationManager.info('Reset password')
      this.setState({ password: '', password2: '' })
    }
  }
 
  updatePreferences = async () => {
    let prefs = this.buildPreferencesFromState()
    let strPrefs = JSON.stringify(prefs)
    
    const res = await updateUserPreferences(strPrefs)
    if (res.status !== 200) {
      NotificationManager.error('Unable to save preferences')
      return
    } 

    NotificationManager.info('Updated preferences')
    this.props.userStore.updateUserPreferences(prefs)
  }

  handleChange = (event) => {    
    let { target } = event
    this.setState({ [target.name]: target.value })
  }

  handleWithValidate = (event) => {
    let { target } = event
    switch(target.name) {
    case 'password':
      this.setState({
        [target.name]: target.value,
        errors: {...this.state.errors, pass1Error: !validatePassword1(target.value)}
      })
      break
    case 'password2':
      this.setState({
        [target.name]: target.value,
        errors: {...this.state.errors, pass2Error: target.value !== this.state.password }
      })
      break
    default:
      this.setState({ [target.name]: target.value })
    }
  }

  render() {
    return(
      <Modal
        isOpen={this.props.showModal}
        contentLabel={'User Preferences'}
        style={customStyles}
      >
         <div className={'preferences'}>
           <div className={'preferences__settings'}>
             {this.state.activeTab === navTabs.GENERAL &&
             <div style={{display: 'flex', flexDirection: 'column'}}>
              <label htmlFor="emailOptions">Email Style</label>
              <select value={this.state.emailStyle} name={'emailStyle'} onChange={this.handleChange}>
                {Object.keys(EMAILPREFS).map(key => {
                  return <option value={key}>{EMAILPREFS[key]}</option>
                })}
              </select>
              <button 
                className={'btn__new'} 
                style={{alignSelf: 'flex-end'}} 
                onClick={this.updatePreferences}>
                  Save
              </button>
             </div>}
             {this.state.activeTab === navTabs.ACCOUNT &&
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <h4>Reset Password</h4>
                  <div className={'input-group'}>
                    <label htmlFor="passsword">Enter password</label>
                    <input type="password" placeholder={'****************'} name={'password'} id="password" onChange={this.handleWithValidate} />
                    {this.state.errors.pass1Error && <span style={errorSpanStyle}>Password must contain 1 lowercase, 1 uppercase, 1 numeric, and be at least 8 characters</span> }
                  </div>
                  <div className="input-group">
                    <label htmlFor="password2">Confirm password</label>
                    <input type="password" name="password2" id="password2" placeholder={'****************'} onChange={this.handleWithValidate} />
                    {this.state.errors.pass2Error && <span style={errorSpanStyle}>Passwords must match</span>}
                  </div>
                  <div className={'input-group'} style={{display: 'flex', marginTop: '20px'}}>
                    <span style={{margin: '0 0 0 auto'}}>
                      <ConfirmButton removeMessage={'Reset'} style={{backgroundColor: 'rgb(18, 141, 233)'}} confirmAction={this.resetPassword} />
                    </span>
                  </div>
                </div>
              </div>
              }

           </div>
           <PreferencesNav 
              close={this.props.toggleModal} 
              tabs={navTabs} 
              activeKey={this.state.activeTab} 
              changeKey={this.changeActiveTab} />
         </div>
      </Modal>
    )
  }
}

UserPreferences.propTypes = {
  showModal: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  userStore: PropTypes.object.isRequired,
}

export default UserPreferences