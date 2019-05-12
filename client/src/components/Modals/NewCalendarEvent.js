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
    // top                   : '50%',
    // left                  : '50%',
    // right                 : 'auto',
    // bottom                : 'auto',
    // marginRight           : '-50%',
    // transform             : 'translate(-50%, -50%)'
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
      activeRoomId: 1,
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
      lessees: [],
    }
  }

  componentDidMount() {
    backend.getRooms(res => {
      let { data } = res
      if (data) {
        this.setState({ rooms: data })
      }
    })

    backend.getAllTDYTypes(res => {
      let { data } = res
      if(data) { this.setState({tdys: data})}
    })

    backend.getAllGuestTypes(res => {
      let { data } = res
      if(data) { this.setState({guests: data})}
    })

    backend.getAllRanks(res => {
      let { data } = res
      if(data) { this.setState({ ranks: data })}
    })

    backend.getAllLessees(res => {
        let { data } = res
        if (data) { this.setState({ lessees: data }) }
    })

    backend.getAllBookingTypes(res => {
      let { data } = res
      if (data) { this.setState({ bookingTypes: data }) }
    })
  }

  createNewEvent = async () => {
    let resData = {
      lesseeid: this.state.lesseeid,
      checkindate: this.state.checkInDate,
      checkoutdate: this.state.checkOutDate,
      bookingtypeid: this.state.bookingTypeId,
      roomid: this.state.activeRoomId,
      pet: this.state.pet,
      purpose: this.state.purpose,
      numberofguests: this.state.numberofguests
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
    NotificationManager.info(`Created event ${event.name}`)
    this.props.closeModal()
  }

  handleChange = (event) => {
    let { target } = event
    let value = target.type === 'checkbox' ? target.checked : target.value
    this.setState({ [target.name]: value })
  }

  setDate = (name, value) => {
    this.setState({ [name]: value })
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
              <div style={{gridArea: 'right', gridRowStart: 1}} className={'input-group'}>
                  <label style={{width: '1005'}}>Select a lessee</label>
                  <select name={'lesseeid'} onChange={this.handleChange} style={{width: 'auto'}} value={this.state.lesseeid}>
                    <option value={0}>-- SELECT A LESSEE --</option>
                    {this.state.lessees.map(lessee => {
                      return <option value={lessee.id}>{`${lessee.lname || ''}, ${lessee.fname || ''} - ${lessee.email || ''}`}</option>
                    })}
                  </select>
              </div>
              {this.state.bookingTypeId !== 0 &&
                <React.Fragment>
                  <div className={'input-group'} style={{gridArea: 'left'}}>
                    <label>Check-in</label> <DayPickerInput onDayChange={day => this.setDate('checkInDate', day)} selectedDays={this.props.eventStart} placeholder={`${formatDate(this.props.eventStart)}`} />
                  </div>
                  <div className={'input-group'} style={{gridArea: 'right'}}>
                    <label>Check-out</label> <DayPickerInput onDayChange={day => this.setDate('checkOutDate', day)} selectedDays={this.state.checkOutDate} placeholder={`${formatDate(this.props.eventStop)}`} />
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