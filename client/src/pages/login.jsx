import React from 'react'
import { observer, inject } from 'mobx-react'

import Login from '../components/Login/Login'

@inject ('userStore')
@observer
class LoginPage extends  React.component {

  setUserInfo = (userId, info) => {
    this.props.userStore.setUserInfo(userId, info)
  }

  render(){
    return  <Login handleSubmit={this.setUserInfo}/>
  }
}

export default LoginPage
