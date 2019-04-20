import { observable, action } from 'mobx'


class UserStore {
  // @observable userInfo = 0

  @action setUserInfo (userId, info) {
    // this.userInfo[userId] = info
    this.userInfo = 'da'
    console.log(this.userInfo)
  }
}

export default new UserStore()