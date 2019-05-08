import { observable, action } from 'mobx'

import * as backend from '../backend'


class RoomStore {
  @observable houses = []
  @observable rooms = []

  @action async populateRoomsAsync() {
    let res = await backend.getRoomsAsync()
    let { data } = res

    if (data) {
      data.map(room => {
        this.addRoom(room)
      })
    }
  }

  @action addHouse(house) {
    if (!this.houses.find(elem => elem.id === house.id)) {
      this.houses.push(house)
    }
  }

  @action addRoom (room) {
    if (!this.rooms.find(elem => elem.id === room.id)) {
      this.rooms.push(room)
    }
  }
}

export default new RoomStore()