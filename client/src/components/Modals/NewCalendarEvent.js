import React from 'react'
import Modal from 'react-modal'
import PropTypes from 'prop-types'

import { NotificationManager } from 'react-notifications'
import { inject, observer } from 'mobx-react'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MomentLocaleUtils, {
  formatDate,
  parseDate,
} from 'react-day-picker/moment';
import 'react-day-picker/lib/style.css';

import { CALENDAR_CLEANING, CALENDAR_CONFIRMED, CALENDAR_TENTATVE } from '../../constants'
import ConfirmButton from '../Buttons/confirm.jsx'
import * as backend from '../../backend'

Modal.setAppElement('#root')

const customStyles = {
  content : {
    boxShadow: '0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.4)'
  },
  overlay : {
    zIndex: 99
  }
};

const gridLayout = {
  display: 'grid',
  gridTemplateColumns: '[left] 50% [right] 50%',
  gridTemplateRows: 'auto',
  justifyItems: 'center'
}

const calendaryTypes = [
    {name: 'Cleaning', value: CALENDAR_CLEANING},
    {name: 'Tentative', value: CALENDAR_TENTATVE},
    {name: 'Confirmed', value: CALENDAR_CONFIRMED}
]

@inject ('reservationStore')
@inject ('scheduleStore')
@inject ('lesseeStore')
@observer
class NewLesseeModal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      tdys: [],
      ranks: [],
      guests: [],
      lesseeid: undefined,
      bookingTypeId: 0,
      bookingTypes: [],
      activeRoomId: undefined,
      checkInDate: this.props.eventStart,
      checkOutDate: this.props.eventStop,
      isCheckInEmpty: true,
      isCheckOutEmpty: true,
      notes: '',
      pet: false,
      numberofguests: undefined,
      purpose: undefined,
      createBooking: false,
      rooms: [],
      houses: [],
      lessees: [],
      dateError: false
    }
  }

  componentDidMount() {

    Promise.all([
      backend.getRoomsAsync(),
      backend.getTdyTypesAsync(),
      backend.getGuestTypesAsync(),
      backend.getAllRanksAsync(),
      backend.getAllBookingTypesAsync(),
      backend.getAllLesseeAsync(),
      backend.getHousesAsync(),
    ]).then(res => {
      this.setState({
        rooms: res[0].data,
        tdys: res[1].data,
        guests: res[2].data,
        ranks: res[3].data,
        bookingTypes: res[4].data,
        lessees: res[5].data,
        houses: res[6].data,
      })
    })
  }

  validateDates = () => {
    let newCheckInDate = new Date(this.state.checkInDate)
    let newCheckOutDate = new Date(this.state.checkOutDate)
    let dateError = newCheckInDate <= newCheckOutDate
    
    this.setState({ dateError })
    return dateError
  }

  validateReservation = () => {

    let shouldBeLessee = this.state.bookingTypeId !== 0 && 
                         (this.getBookingTypeName(this.state.bookingTypeId) !== CALENDAR_CLEANING)

    return (!shouldBeLessee || this.state.lesseeid) &&
           this.validateDates()
  }

  createNewEvent = async () => {
    let newCheckInDate = new Date(this.state.checkInDate)
    let newCheckOutDate = new Date(this.state.checkOutDate)
    newCheckInDate.setHours(0,0,0,0)
    newCheckInDate.setDate(newCheckInDate.getDate() + 1)
    newCheckOutDate.setHours(23, 30, 0, 0)

    let resData = {
      lesseeid: this.state.lesseeid,
      checkindate: newCheckInDate,
      checkoutdate: newCheckOutDate,
      bookingtypeid: this.state.bookingTypeId || 1,
      houseid: this.state.houseid || 1,
      roomid: this.state.activeRoomId || 1,
      pet: this.state.pet,
      purpose: this.state.purpose,
      numberofguests: this.state.numberofguests,
      doorcode: this.state.doorcode,
    }
    if (this.validateReservation()) {

      if (this.getBookingTypeName(this.state.bookingTypeId) === CALENDAR_CLEANING) {
        const res = await backend.newHouseReservationAsync(resData)
        if (res.status !== 200) {
          NotificationManager.error(`Unable to create calendar event!`)
          return
        }
        let { data } = res
        NotificationManager.info(`Created event cleaning for house ${data[0].house}`)
        this.props.closeModal()
        return
      }

      backend.createNewReservation(resData, (res) => {
        if (res.status !== 200) {
          NotificationManager.error(`Unable to create calendar event!`)
          return
        }
        let { data } = res
        if (data){
          let res = this.props.reservationStore.addReservationFromResObject(data)
          this.props.scheduleStore.addEvent(res)
        }
      })
      let event = this.state.bookingTypes.find(type => parseInt(type.id) === parseInt(this.state.bookingTypeId))
      if (this.state.lesseeid) {
        let roomObj = this.state.rooms.find(room => parseInt(room.id) === resData.roomid)
        this.props.lesseeStore.updateFormattedLesseeValue(this.state.lesseeid, 
          'reservations', `${roomObj.name} - ${this.state.checkInDate}`)
      }
      NotificationManager.info(`Created event ${event.name}`)
      this.props.closeModal()
    } else {
      NotificationManager.error('All fields need to be filled out!')
    }
  }

  handleChange = (event) => {
    let { target } = event
    let value = target.type === 'checkbox' ? target.checked : target.value
    this.setState({ [target.name]: value })
  }

  setDate = (name, value) => {
    this.setState({ [name]: value }, this.validateDates)
  }

  getBookingTypeName = (id) => {
    let bookingType = this.state.bookingTypes.find(type => parseInt(type.id) === parseInt(id))
    if (bookingType) {
      return bookingType.name
    }

    return ''
  }

  render() {
    return (
      <div>
        <Modal
          isOpen={this.props.showModal}
          contentLabel="New Calendar Event"
          style={customStyles}
        >
          <div className={''}>
            <div style={{...gridLayout}}>
              <div style={{gridArea: 'left', gridRowStart: 1}} className={'input-group'}>
                  <label style={{width: '1005'}}>Select a calendar type</label>
                  <select name={'bookingTypeId'} onChange={this.handleChange} style={{width: 'auto'}} value={this.state.bookingTypeId}>
                    <option value={0}>-- CALENDAR TYPE --</option>
                    {this.state.bookingTypes.map(type => {
                      return <option value={type.id}>{type.name}</option>
                    })}
                  </select>
              </div>
              {this.getBookingTypeName(this.state.bookingTypeId) !== CALENDAR_CLEANING &&
              <div style={{gridArea: 'right', gridRowStart: 1}} className={'input-group'}>
                  <label style={{width: '1005'}}>Select a lessee</label>
                  <select name={'lesseeid'} onChange={this.handleChange} style={{width: 'auto'}} value={this.state.lesseeid}>
                    <option value={0}>-- SELECT A LESSEE --</option>
                    {this.state.lessees.map(lessee => {
                      return <option value={lessee.id}>{`${lessee.lname || ''}, ${lessee.fname || ''} - ${lessee.email || ''}`}</option>
                    })}
                  </select>
              </div>
              }
              {this.getBookingTypeName(this.state.bookingTypeId) === CALENDAR_CLEANING &&
                <React.Fragment>
                  <div className={'input-group'} style={{gridArea: 'left'}}>
                    <label>Check-in</label> <DayPickerInput onDayChange={day => this.setDate('checkInDate', day)} selectedDays={this.props.eventStart} placeholder={`${formatDate(this.props.eventStart)}`} />
                  </div>
                  <div className={'input-group'} style={{gridArea: 'right'}}>
                    <label>Check-out</label> <DayPickerInput onDayChange={day => this.setDate('checkOutDate', day) } selectedDays={this.state.checkOutDate} placeholder={`${formatDate(this.props.eventStop)}`} />
                    {!this.state.dateError && <span className={'error-span'}>CHECKOUT DATE CANNOT BE BEFORE CHECKINDATE</span>}
                  </div>
                  <div className={'input-group'}>
                    <label>House</label><br />
                    <select name={'houseid'} onChange={this.handleChange} value={this.state.houseid}>
                      {this.state.houses.map(house => {
                        return <option value={house.id}>{house.name}</option>
                      })}
                    </select>
                  </div>
                </React.Fragment>
              }
              {this.state.bookingTypeId !== 0 && this.getBookingTypeName(this.state.bookingTypeId) !== CALENDAR_CLEANING &&
                <React.Fragment>
                  <div className={'input-group'} style={{gridArea: 'left'}}>
                    <label>Check-in</label> <DayPickerInput onDayChange={day => this.setDate('checkInDate', day)} selectedDays={this.props.eventStart} placeholder={`${formatDate(this.props.eventStart)}`} />
                  </div>
                  <div className={'input-group'} style={{gridArea: 'right'}}>
                    <label>Check-out</label> <DayPickerInput onDayChange={day => this.setDate('checkOutDate', day)} selectedDays={this.state.checkOutDate} placeholder={`${formatDate(this.props.eventStop)}`} />
                    {!this.state.dateError && <span className={'error-span'}>CHECKOUT DATE CANNOT BE BEFORE CHECKINDATE</span>}                  
                  </div>
                  <div className={'input-group'}>
                    <label style={{width: '100%'}}>Purpose</label> 
                    <select onChange={this.handleChange} name={'purpose'} style={{width: '70%'}}>
                      {
                        this.state.tdys.map(tdy => {
                          return <option value={tdy.id}>{tdy.name}</option>
                        })
                      }
                    </select>
                  </div>
                  <div className={'input-group'}>
                    <label style={{width: '100%'}}>Any guests? </label> <br />
                    <select onChange={this.handleChange} name={'numberofguests'} style={{width: '70%'}}>
                      {this.state.guests.map(guest => {
                        return <option value={guest.id}>{guest.name}</option>
                      })}
                    </select>
                  </div>
                  <div className={'input-group'}>
                    <label>Room</label><br />
                    <select name={'activeRoomId'} onChange={this.handleChange} value={this.state.activeRoomId}>
                      {this.state.rooms.map(room => {
                        return <option value={room.id}>{room.name}</option>
                      })}
                    </select>
                  </div>
                  <div className={'input-group'}>
                      <label>Room door code</label><br />
                      <input type="text" name={'doorcode'} onChange={this.handleChange} />
                  </div>
                </React.Fragment>
              }
            </div>
          </div>
          <div className={'input-group'} style={{width: '100%', display: 'flex', justifyContent: 'space-evenly', marginTop: '20px'}}>
            <ConfirmButton removeMessage={'Cancel'} confirmAction={this.props.closeModal}/>
            { this.state.bookingTypeId !== 0 && <ConfirmButton removeMessage={'Create'} confirmAction={this.createNewEvent} style={{backgroundColor: '#128de9'}} /> }
          </div>
        </Modal>
      </div>
    )
  }
}

NewLesseeModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired
}

export default NewLesseeModal