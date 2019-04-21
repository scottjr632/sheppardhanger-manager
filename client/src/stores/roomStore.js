import { observable, action } from 'mobx'


class RoomStore {
  @observable houses = []
  @observable rooms = []

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