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
  _initalArray = {
    set: false,
    value: []
  }

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
        this._initalArray.value = this.formattedLessees.slice()
        this._initalArray.set = true
      })
    }
  }

  @action updateFormattedLessee(lessee) {
    let lesseeIndex = this.formattedLessees.indexOf(value => parseInt(value.id) === parseInt(lessee.id))
    if (lesseeIndex !== -1) {
      this.formattedLessees[lesseeIndex] = lessee
    }
  }

  @action updateFormattedLesseeValue(lesseeId, key, value) {
    let lesseeIndex = this.formattedLessees.indexOf(value => parseInt(value.id) === parseInt(lesseeId))
    if (lesseeIndex !== -1) {
      this.formattedLessees[lesseeIndex][key] = value
    }
  }

  @action updateLessee(lessee) {
    let lesseeIndex = this.lessees.indexOf(value => parseInt(value.id) === parseInt(lessee.id))
    if (lesseeIndex !== -1) {
      this.lessees[lesseeIndex] = lessee
    }
  }

  @action removeLessee(lessee) {
    let lessees = this.lessees
    let formattedLessees = this.formattedLessees

    let lesseeIdx = lessees.findIndex(elem => parseInt(elem.id) === parseInt(lessee.id))
    let formatedLesseeIdx = formattedLessees.findIndex(elem => parseInt(elem.id) === parseInt(lessee.id))

    this.lessees.splice(lesseeIdx, 1)
    this.formattedLessees.splice(formatedLesseeIdx, 1)
  }

  @action addNewLessee(lessee) {

    if (!this.lessees.find(elem => elem.id === lessee.id)) {
      this.lessees.push(lessee)
      let formatedLessee = formatLessee(lessee)
      this.formattedLessees.push(formatedLessee)
      this._initalArray.value.push(formatedLessee)
    }
  }

  @action sortFormattedLessees(sortKey, sortOrder) {
    let data = this.formattedLessees.slice()
    
    // sort the table
    data.sort((a, b) => {
      const val1 = a[sortKey].toString().toUpperCase();
      const val2 = b[sortKey].toString().toUpperCase();
      if (isNaN(val1) && isNaN(val2)) {
        return val1 < val2 ? -sortOrder : val1 > val2 ? sortOrder : 0;
      } else {
        return sortOrder === 1 ? val1 - val2 : val2 - val1;
      }
    });

    this.formattedLessees = data
  }

  @action searchformattedLessees(filter, searchCode) {
    let _tempArray = this._initalArray.value.slice()
    let data = this.formattedLessees.slice()

    this.formattedLessees = _tempArray.filter(value => { return value[searchCode].toUpperCase().indexOf(filter) >= 0 })
  }
}

export default new LesseeStore()