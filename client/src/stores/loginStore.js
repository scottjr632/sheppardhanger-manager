import { observable, action } from 'mobx'


class LoginStore {
  @observable authenticated = false
  @observable email = 'admin@admin.sheppardhanger.com'

  @action setAuthenticated (auth) {
    this.authenticated = auth
  }

  @action setEmail (email) {
    this.email = email
  }

}

export default new LoginStore()