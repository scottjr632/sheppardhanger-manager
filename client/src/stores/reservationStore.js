import { observable, action } from 'mobx'

import * as backend from '../backend'
import { BOOKINGTYPECOLORS } from '../constants'

const formatReservation = (reservationObject) => {
    return {
        id: reservationObject.id,
        resourceId: reservationObject.roomid,
        title: `${reservationObject.lesseelname}, ${reservationObject.lesseefname}  -  ${reservationObject.house} ${reservationObject.bookingtype}`,
        start: reservationObject.checkindate,
        end: reservationObject.checkoutdate,
        lesseeId: reservationObject.lesseeid,
        bgColor: BOOKINGTYPECOLORS[reservationObject.bookingtype]
    }
}

class ReservationStore {
    
    @observable reservations = []

    @action async populateReservationsAsync(){
        let res = await backend.getAllReservationsAsync()
        let { data } = res
        if (data) {
            data.forEach(reservation => {
                this.addReservationFromResObject(reservation)
            })
        }
    }

    @action populateReservations(callback){
        backend.getAllReservations(res => {
            let { data } = res
            if (data){
                data.forEach(reservation => {
                    this.addReservationFromResObject(reservation)
                })
            }
            return callback(this.reservations)
        })
    }

    @action addReservation(reservation) {
        if(!this.reservations.find(res => res.id === reservation.id)) {
            this.reservations.push(reservation)
        }
    }

    @action addReservationFromResObject(reservationObject) {
        let reservation = formatReservation(reservationObject)
        this.addReservation(reservation)
        return reservation
    }

    @action updateReservation(reservation) {
        let reservations = this.reservations

        let index = reservations.findIndex(elem => elem.id === reservation.id)
        this.reservations[index] = reservation
    }

    @action removeReservation(reservation) {
        let reservations = this.reservations
        
        let index = reservations.findIndex(elem => parseInt(elem.id) === parseInt(reservation.id))
        this.reservations.splice(index, 1)
    }

}

export default new ReservationStore()