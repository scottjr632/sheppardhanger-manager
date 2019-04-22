import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import { NotificationManager } from 'react-notifications'

import * as backend from '../../backend'


@inject('userStore')
@observer
class Navi extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      currentKey: 1,
      showDropdown: false
    }

  }

  componentDidMount(){
    switch(window.location.pathname) {
      case '/dashboard':
        this.setState({
          currentKey: 1
        })
        break
      case '/user/alerts':
        this.setState({
          currentKey: 2
        })
        break
      case '/stocks':
        this.setState({
          currentKey: 3
        })
        break
      default:
        break
    }
  }


  handleSelect = (selectedKey) => {
    this.setState({
      currentKey: selectedKey
    })
  }

  showDropdown = () => {
    this.setState({showDropdown: !this.state.showDropdown})
  }

  handleLogout = () => {
    backend.logout(status => {
      if (status !== 200) {
        NotificationManager.error('Unable to log you out. Please try again.')
        return
      }

      window.location.href = '/'
    })
  }

  render() {
    return (
      <header>
        <div className={'pull-left header-title'}>
          The Sheppard Hanger <span style={{textTransform: 'uppercase', fontSize: '15pt'}}>Manager</span>
        </div>
        <div className={'pull-right nav__link'}>
          <a className={this.state.currentKey === 1 ? 'active' : ''} onClick={() => this.handleSelect(1)}>Home</a>
          <a className={this.state.currentKey === 2 ? 'active' : ''} onClick={() => this.handleSelect(2)}>Admin</a>
          <span className={'username dropdown__toggle'} onClick={this.showDropdown}>
              <a className={this.state.currentKey === 3 ? 'active' : ''}>
                  <i className="fas fa-user" />
                {this.props.userStore.email}
              </a>
            {this.state.showDropdown &&
            <div className={'dropdown__menu'} onMouseLeave={this.showDropdown}>
              <span onClick={this.handleLogout}>
                <i className="fas fa-sign-out-alt"/>
                <a>Logout</a>
              </span>
            </div>
            }
          </span>
        </div>
      </header>
    )
  }
}

Navi.propTypes = {
  userName: PropTypes.string.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired
}

export default withRouter(Navi);