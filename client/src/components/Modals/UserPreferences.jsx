import React from 'react'
import PropTypes from 'prop-types'

import Modal from 'react-modal'
import { inject, observer } from 'mobx-react';

import PreferencesNav from '../Misc/PreferencesNav.jsx';
import ConfirmButton from '../Buttons/confirm.jsx';
import { validatePassword1 } from '../../utils'
import { SCHEDULER_VIEWS } from '../../constants'
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
    padding: '0',
    boxShadow: '0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.4)'
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
      activeTab: this.props.userStore.shouldresetpassword ? navTabs.ACCOUNT : navTabs.GENERAL,
      preferences: preferences,
      emailStyle: preferences.emailStyle || '',
      cellWidth: preferences.monthCellWidth ? preferences.monthCellWidth.replace('%', '') : 3,
      selectedViews: preferences.selectedViews || [],
      views: preferences.views || [],
      errors: {
        pass1Error: false,
        pass2Error: false
      }
    }
  }

  componentWillRecieveProps(nextProps) {
    if (nextProps.userStore.preferences !== this.state.preferences) {
      let { emailStyle, monthCellWidth, selectedViews, views } = nextProps.userStore.preferences
      this.setState({ 
        preferences: nextProps.userStore.preferences,
        emailStyle: emailStyle,
        cellWidth:  monthCellWidth ? monthCellWidth.replace('%', '') : 3,
        selectedViews: selectedViews || [],
        views: views || [],
      })
    }
  }

  changeActiveTab = (activeTab) => {    
    this.setState({ activeTab })
  }

  buildPreferencesFromState = () => {
    return {
      emailStyle: this.state.emailStyle,
      selectedViews: this.state.selectedViews,
      views: this.state.views,
      monthCellWidth: `${this.state.cellWidth}%`,
    }
  }

  resetPassword = () => {
    if (validatePassword1(this.state.password) && 
        this.state.password === this.state.password2) {
      updateUserPassword(this.state.password)
      NotificationManager.info('Reset password')
      this.props.userStore.setshouldresetpassword(false)
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

  toggleSelectedView = (viewName) => {
    let { selectedViews, views } = this.state
    let viewNameIdx = selectedViews.findIndex(name => name === viewName )
    if (viewNameIdx < 0) {
      let viewIdx = SCHEDULER_VIEWS.findIndex(view => view.viewName === viewName)

      selectedViews.push(viewName)
      views.push(SCHEDULER_VIEWS[viewIdx])
    } else {
      let viewIdx = views.findIndex(view => view.viewName === viewName)

      selectedViews.splice(viewNameIdx, 1)
      views.splice(viewIdx, 1)
    }
  
    this.setState({ selectedViews, views })
  }

  handleSelectedViews = (event) => {
    let { target } = event
    this.toggleSelectedView(target.name)
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
    let { shouldresetpassword } = this.props.userStore
    return(
      <Modal
        isOpen={this.props.showModal || shouldresetpassword}
        contentLabel={'User Preferences'}
        style={customStyles}
      >
         <div className={'preferences'}>
           <div className={'preferences__settings'}>
             {this.state.activeTab === navTabs.GENERAL &&
             <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                <div className="input-group" >
                  <h4>Scheduler cell size</h4>
                  <span style={{ display: 'flex', flexDirection: 'row' }}>
                    <label htmlFor={'cellWidth'}>Size of cells (%)</label>
                    <input type="number" name="cellWidth" value={this.state.cellWidth} style={{ width: '50px', minWidth: '2px', textAlign: 'center' }} onChange={this.handleChange} />
                  </span>
                </div>
                <div className="input-group">
                  <h4>Scheduler Views</h4>
                  {SCHEDULER_VIEWS.map(view => {
                    let { viewName } = view
                    return (
                      <div>
                        <span style={{ display: 'flex', flexDirection: 'row' }}>
                          <input type="checkbox" checked={ this.state.selectedViews.includes(viewName) } name={viewName} onChange={this.handleSelectedViews} />
                          <label>{viewName}</label>
                        </span>
                      </div>
                    )
                  })}
                </div>
                <br/>
              </div>
              <div style={{ textAlign: 'center' }}>
                <h4>Update will require page refresh to take affect</h4>
                <button className="btn__new" onClick={this.updatePreferences}>
                  Update
                </button>
              </div>
            </div>
            }
             {this.state.activeTab === navTabs.ACCOUNT  &&
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  {shouldresetpassword && <h4>We have updated our password security. In order to enhance security, please reset your password.</h4>}
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