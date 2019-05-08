import { observable, action } from 'mobx'

import * as backend from '../backend'

const formatLessee = (lessee) => {
 return  {
    name: `${lessee.lname}, ${lessee.fname}`,
      email: lessee.email,
    phone: lessee.phone || '',
    rank: lessee.rank || '',
    reservations: lessee.reservations && lessee.reservations.length > 0
    ? `${lessee.reservations[0].room} - ${lessee.reservations[0].checkindate}`
    : '',
    exandableInfo: `Address: ${lessee.address}
              City: ${lessee.city}
              State: ${lessee.state}
              Notes: ${lessee.notes}`,
    id: lessee.id,
  }
}

class LesseeStore {
  @observable lessees = []
  @observable formattedLessees = []

  @action populateLessees() {
    if (this.lessees.length === 0) {
      backend.getAllLessees(res => {
        let { data } = res
        if (data) {
          data.forEach(lessee => {
            let formattedLessee = formatLessee(lessee)
            this.formattedLessees.push(formattedLessee)
            this.lessees.push(lessee)
          })
        }
      })
    }
  }

  @action addNewLessee(lessee) {

    if (!this.lessees.find(elem => elem.id === lessee.id)) {
      this.lessees.push(lessee)
      let formatedLessee = formatLessee(lessee)
      this.formattedLessees.push(formatedLessee)
    }
  }

}

export default new LesseeStore()