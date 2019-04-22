import { observable, action } from 'mobx'


class LesseeStore {
  @observable lessees = []

  @action addNewLessee(lessee) {

    if (!this.lessees.find(elem => elem.id === lessee.id)) {
      this.lessees.push(lessee)
    }
  }

}

export default new LesseeStore()