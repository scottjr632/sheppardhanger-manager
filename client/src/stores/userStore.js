import { observable, action } from 'mobx'
import { NotificationManager } from 'react-notifications'

import * as backend from '../backend'



class UserStore {
  @observable authenticated = false
  @observable fullname = ''
  @observable id = 0
  @observable email = ''
  @observable loginError = false

  @action loginUser (userInfo, callback) {
    backend.authenticateUser(userInfo, res => {
      this.loginError = false
      this.authenticated = false

      let { id, email, lname, fname } = res
      if ( id && email ) {

        this.id = id
        this.email = email
        this.fullname = (lname || '') + ', ' + (fname || '')
        this.authenticated = true
        return callback()
      } else {
        NotificationManager.error('Username or password was incorrect.', '', 5000)
        this.loginError = true
        this.authenticated = false

      }
    })
  }
}

export default new UserStore()