import React from 'react'
import PropTypes, { array } from 'prop-types'

import { NotificationManager } from 'react-notifications'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

import ConfirmButton from '../Buttons/confirm.jsx'
import * as backend from '../../backend'
import { STATUS_ACTIVE, STATUS_ARCHIVED } from '../../constants'
import { inject, observer } from 'mobx-react';

const formatReservation = (reservation, callback) => {
  return {
    'bookingtype': reservation.bookingtype,
    'checkindate': reservation.checkindate,
    'checkoutdate': reservation.checkoutdate,
    'room': reservation.room,
    'doorcode': reservation.doorcode,
    'house': reservation.house,
    'lengthofstay': reservation.lengthofstay,
    'lesseeemail' : reservation.lesseeemail ? 
     <React.Fragment onClick={callback}>
       <div onClick={callback} style={{cursor: 'pointer'}}>
        <i className="fas fa-external-link-alt" style={{marginRight: '10px', cursor: 'pointer'}} ></i>
        {reservation.lesseeemail}
       </div>
     </React.Fragment> : '',
    'lesseefname': reservation.lesseefname,
    'lesseelname': reservation.lesseelname,
    'numberofguests': reservation.numberofguests,
    'purpose': reservation.purpose,
    'notes': reservation.notes,
  }
}

const inputStyle = {
  borderBottom: '1pt #d8d5d5 solid'
}

const editStyle = {
  backgroundColor: '#128de9'
}

const saveStyle = {
  backgroundColor: '#12e96f'
}

const disabledStyle = {
  ...inputStyle,
  backgroundColor: '#c7c7c76e',
  borderRadius: '3px',
  paddingLeft: '5px'
}


const excludedTypes = [
  'bookingtypeid',
  'id',
  'pet', 
  'roomid',
  'lesseeid',
]

const nonEditableTypes = [
  'status',
  'lesseeemail',
  'lesseefname',
  'lesseelname'
]

const prettyNames = {
  'bookingtype' : 'Booking type',
  'checkindate' : 'Check-in-date',
  'checkoutdate' : 'Check-out-date',
  'lengthofstay': 'Length of stay (days)',
  'lesseeemail' : 'Lessee email', 
  'lesseefname' : 'First name', 
  'lesseelname' : 'Last name', 
  'numberofguests' : 'Guests',
  'doorcode': 'Door code'
}

@inject('reservationStore')
@observer
class Info extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      editable: this.props.editable || false,
      edit: false,
      bookingTypes: [],
      rooms: [],
      houses: [],
      purposeTypes: [],
      reservation: {...this.props.data}
    }
  }

  componentWillMount(){
    Promise.all([
      backend.getAllBookingTypesAsync(), 
      backend.getRoomsAsync(), 
      backend.getHousesAsync(),
      backend.getGuestTypesAsync(),
      backend.getTdyTypesAsync()
    ]).then(res => {
      this.setState({
        bookingTypes: res[0].data,
        rooms: res[1].data,
        houses: res[2].data,
        guests: res[3].data,
        purposeTypes: res[4].data,
      })
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({reservation: {...nextProps.data}})
  }

  archiveReservation = () => {
    backend.updateReservationStatus(this.props.data.id, STATUS_ARCHIVED, (res) => {
      let { data } = res
      if (data) {
        if (res.status !== 200) {
          NotificationManager.error(data)
        } else {
          this.props.reservationStore.removeReservation({id: this.props.data.id})
          NotificationManager.info(data)
        }
      } else {
        NotificationManager.error('Unable to update reservations status!')
      }
    })
  }

  updateReservation = () => {
    let upd_data = {...this.state.reservation, purpose: this.state.reservation.purposeid, numberofguests: this.state.reservation.numberofguestsid }
    if (this.validateDates()) {
      backend.updateReservation(upd_data, res => {
        if (res.statusText !== 'OK') {
          NotificationManager.error('Unable to update reservation!')
          this.toggleEdit()
          return
        }
  
        NotificationManager.info('Updated reservation!')
        NotificationManager.info('Please refresh to see changes...')
        this.toggleEdit() 
      })
    } else {
      NotificationManager.error('Checkout date cannot be before check in date! ')
    }

  }

  handleChange = (event) => {
    event.persist()
    let { target } = event
    this.setState({
      reservation: {
        ...this.state.reservation,
        [target.name]: target.value
      }
    })
  }

  setDate = (name, value) => {
    this.setState( {
      reservation: {
        ...this.state.reservation,
        [name]: value
      }
    }, this.validateDates )
  }

  goToLesseePage = (lesseeId) => {
    this.props.history.push(`/info?id=${lesseeId}`)
  }

  toggleEdit = () => {
    this.props.toggleEdit()
  }

  validateDates = () => {
    let newCheckInDate = new Date(this.state.reservation.checkindate)
    let newCheckOutDate = new Date(this.state.reservation.checkoutdate)
    let dateError = newCheckInDate <= newCheckOutDate
    
    this.setState({ dateError }, () => console.log('==============>',' dateerror', dateError)
    )
    return dateError
  }

  render(){
    let data = formatReservation(this.state.reservation, () => this.goToLesseePage(this.props.data.lesseeid))
    
    return (
      <div className={'table'} style={{gridArea: 'right'}}>
        <div className={'table-wrapper full'}>
          <table className="table-responsive card-list-table">
            <thead>
              <tr>
                { Object.keys(data).map(key => { return <th>{key}</th> }) }
              </tr>
            </thead>
            <tbody>
              <tr>
                {!this.props.editing &&
                  Object.keys(data).map(key => {
                    if (!excludedTypes.includes(key)) {
                      let name = prettyNames[key] || key
                      return <td key={key} data-title={name}>{data[key]}</td>
                    }
                  })
                }
              {this.props.editing && 
                  Object.keys(data).map(key => {
                    if (!excludedTypes.includes(key)) {
                      let name = prettyNames[key] || key
                      switch (key) {
                      case 'lengthofstay':
                      case 'lesseeemail':
                        return (
                          <td data-title={name}>
                            <span className={'border-grow'}></span>
                            <input name={key} value={this.state.reservation[key]} style={inputStyle} onChange={this.handleChange} disabled />
                          </td>
                        )
                      case 'checkindate':
                      case 'checkoutdate':
                        return (
                          <td data-title={name}>
                            <span className={'border-grow'}></span>
                            {/* <input name={key} value={this.state.reservation[key]} style={inputStyle} onChange={this.handleChange} /> */}
                            <DayPickerInput onDayChange={day => this.setDate(key, day)} />
                            {!this.state.dateError && <span className={'error-span'}>CHECKOUT DATE CANNOT BE BEFORE CHECKINDATE</span>}
                          </td>
                        ) 
                      case 'room':
                        return (
                          <td data-title={'rooms'}>
                              <select name={'roomid'} onChange={this.handleChange} value={this.state.reservation.roomid}>
                                {this.state.rooms.map(room => {
                                  return <option value={room.id}>{room.name}</option>
                                })}
                              </select>
                          </td>
                        )
                      case 'house':
                        return (
                          <td data-title={'houses'} className="tooltip">
                            <span className="tooltiptext">House names will change when room is updated</span>
                            <select disabled>
                              {this.state.houses.map(house => {
                                return <option value={house.id}>{house.name}</option>
                              })}
                            </select>
                          </td>
                        )
                      case 'bookingtype':
                        return (
                          <td data-title={'Booking Type'}>
                            <select name={'bookingtypeid'} onChange={this.handleChange} value={this.state.reservation.bookingtypeid}>
                              {this.state.bookingTypes.map(btype => {
                                if (this.state.reservation.bookingtype !== 'CLEANING' && btype.name === 'CLEANING') {
                                  return <option value={btype.id} disabled={true}>{btype.name}</option>
                                } else if (this.state.reservation.bookingtype === 'CLEANING' && btype.name !== 'CLEANING'){
                                    return <option value={btype.id} disabled={true}>{btype.name}</option>
                                }
                                return <option value={btype.id}>{btype.name}</option>
                              })}
                            </select>
                          </td>
                        )
                      case 'numberofguests':
                          return (
                            <td data-title={'GUESTS'}>
                              <select name={'numberofguestsid'} onChange={this.handleChange} value={this.state.reservation.numberofguestsid}>
                                {this.state.guests.map(btype => {
                                  return <option value={btype.id}>{btype.name}</option>
                                })}
                              </select>
                            </td>
                          )
                      case 'status':
                        return (
                          <td data-title={'STATUS'}>
                            <select name={'status'} onChange={this.handleChange} value={this.state.reservation.status}>
                              <option value={STATUS_ARCHIVED}>{STATUS_ARCHIVED}</option>
                              <option value={STATUS_ACTIVE}>{STATUS_ACTIVE}</option>
                            </select>
                          </td>
                        )
                      case 'purpose':
                        return (
                          <td data-title={'PURPOSE'}>
                            <select name={'purposeid'} onChange={this.handleChange} value={this.state.reservation.purposeid}>
                              {this.state.purposeTypes.map(btype => {
                                  return <option value={btype.id}>{btype.name}</option>
                              })}
                            </select>
                          </td>
                        )
                      default:
                        let disabled = nonEditableTypes.includes(key)
                        return (
                          <td data-title={name}>
                            <span className={'border-grow'}></span>
                            <input name={key} value={this.state.reservation[key]} style={disabled ? disabledStyle : inputStyle} onChange={this.handleChange} disabled={disabled} />
                          </td>
                        )
                      }
                    }
                  })
                }
              </tr>
            </tbody>
          </table>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', margin: '10px 0 10px 0'}}>
            {!this.props.editing  && <ConfirmButton removeMessage={'Archive'} confirmAction={this.archiveReservation} /> }
            {this.props.editing && <ConfirmButton removeMessage={'Cancel'} confirmAction={this.toggleEdit} /> }

            {!this.props.editing  && <ConfirmButton removeMessage={'Edit'} confirmAction={this.toggleEdit} style={editStyle} /> }
            {this.props.editing && <ConfirmButton removeMessage={'Save'} confirmAction={() => { this.updateReservation() }} style={saveStyle} /> }
          </div>

        </div>
      </div>
    )
  }
}

Info.propTypes = {
    data: PropTypes.object.isRequired,
    toggleEdit: PropTypes.func.isRequired,
    editing: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    editable: PropTypes.bool
}

export default Info