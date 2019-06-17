import React from 'react'
import PropTypes from 'prop-types'

import Modal from 'react-modal'
import { inject, observer } from 'mobx-react';

import PreferencesNav from '../Misc/PreferencesNav.jsx';
import { EMAILPREFS } from '../../constants'
import { NotificationManager } from 'react-notifications'
import { updateUserPreferences } from '../../backend'

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
    this.setState({ [target.name]: target.value}, () => {
      console.log(this.state);
      
    })
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
             </div>}
             {this.state.activeTab === navTabs.ACCOUNT &&
              <section>

              </section>
              }
              <button 
                className={'btn__new'} 
                style={{alignSelf: 'flex-end'}} 
                onClick={this.updatePreferences}>
                  Save
                </button>
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