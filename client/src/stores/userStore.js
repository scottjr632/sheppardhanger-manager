import { observable, action, reaction } from 'mobx'
import { NotificationManager } from 'react-notifications'

import * as backend from '../backend'


class UserStore {
  @observable authenticated = false
  @observable fullname = ''
  @observable id = 0
  @observable email = ''
  @observable loginError = false
  @observable role = 'user'

  constructor() {
    backend.authenticate(res => {
      if (res === 200) {
        this.authenticated = true
      }
    })
  }

  @action loginUser (userInfo, callback) {
    backend.authenticateUser(userInfo, res => {
      this.loginError = false
      this.authenticated = false

      let { id, email } = res
      if ( id && email ) {
        this.authenticated = true
        return callback(true)
      } else {
        NotificationManager.error('Username or password was incorrect.', '', 5000)
        this.loginError = true
        this.authenticated = false
        return callback(false)
      }
    })
  }

  @action loginUserStay (userInfo, callback) {
    backend.authenticateUserStay(userInfo, res => {
      this.loginError = false
      this.authenticated = false

      let { id, email } = res
      if ( id && email ) {
        this.authenticated = true
        return callback(true)
      } else {
        NotificationManager.error('Username or password was incorrect.', '', 5000)
        this.loginError = true
        this.authenticated = false
        return callback(false)
      }
    })
  }

  @action setUserInfo() {
    backend.getUserInfo(res => {
      let { id, email, lname, fname, role } = res.data
      if ( id && email ) {
        this.id = id
        this.email = email
        this.fullname = (lname || '') + ', ' + (fname || '')
        this.role = role || 'user'
      }
    })
  }


  authenticateReaction = reaction(
    () => this.authenticated,
    auth => {
      if (auth) {
        this.setUserInfo()
      }
    }
  )
}

export default new UserStore()