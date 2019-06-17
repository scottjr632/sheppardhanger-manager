import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import { NotificationManager } from 'react-notifications'

import * as backend from '../../backend'

const dropDownStyle = {
  display: 'flex', 
  flexDirection: 'column'
}

const navStyle = {
  display: 'inline-flex'
}

const links = [
  {key: 1, name: 'Home', path: '/dashboard'},
  {key: 2, name: 'Admin', path: '/admin'}
]

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
    let activeLink = links.find(link => link.path == window.location.pathname)
    if (activeLink) this.setState({currentKey: activeLink.key})
  }

  handleSelect = (selectedKey) => {

    let selected = links.find(link => link.key === selectedKey)
    this.props.history.push(selected.path)

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
        <div className={'pull-right nav__link'} style={navStyle}>
          {links.map(link => {
            return <a className={this.state.currentKey === link.key ? 'active' : ''} key={link.key} onClick={() => this.handleSelect(link.key)}>{link.name}</a>
          })}
          <span className={'username dropdown__toggle'} style={dropDownStyle} onClick={this.showDropdown}>
              <a className={this.state.currentKey === 3 ? 'active' : ''}>
                  <i className="fas fa-user" />
                {this.props.userStore.email}
                {this.state.showDropdown &&
                <div className={'dropdown__menu'} onMouseLeave={this.showDropdown}>
                  <div onClick={this.handleLogout} style={{padding: '5px 0'}}>
                    <i class="fas fa-user-cog" />
                    <a>Preferences</a>
                  </div>
                  <div onClick={this.handleLogout} style={{padding: '5px 0'}}>
                    <i className="fas fa-sign-out-alt"/>
                    <a>Logout</a>
                  </div>
                </div>
                }
              </a>
          </span>
        </div>
      </header>
    )
  }
}

Navi.propTypes = {
  userStore: PropTypes.object,
}

export default withRouter(Navi);