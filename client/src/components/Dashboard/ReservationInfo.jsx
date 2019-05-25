import React from 'react'
import PropTypes, { array } from 'prop-types'

import { NotificationManager } from 'react-notifications'

import ConfirmButton from '../Buttons/confirm.jsx'
import * as backend from '../../backend'
import { STATUS_ACTIVE, STATUS_ARCHIVED } from '../../constants'
import { inject, observer } from 'mobx-react';

const inputStyle = {
  borderBottom: '1pt #d8d5d5 solid'
}

const editStyle = {
  backgroundColor: '#128de9'
}

const excludedTypes = [
  'bookingtypeid',
  'id',
  'pet', 
  'roomid',
  'lesseeid'
]

const prettyNames = {
  'bookingtype' : 'Booking type',
  'checkindate' : 'Check-in-date',
  'checkoutdate' : 'Check-out-date',
  'lesseeemail' : 'Email', 
  'lesseefname' : 'First name', 
  'lesseelname' : 'Last name', 
  'numberofguests' : 'Guests',
  'lengthofstay': 'Length of stay (days)'
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
    if (this.state.bookingTypes.length === 0) {
      backend.getAllBookingTypes((res) => {
        let { data } = res
        if (data) this.setState({ bookingTypes: data }) 
      })
    }

    backend.getRooms(res => {
      let { data } = res
      if (data) {
        this.setState({ rooms: data })
      }
    })

    backend.getHouses(res => {
      let { data } = res
      if (data) {
        this.setState({ houses: data })
      }
    })

    backend.getAllTDYTypes(res => {
      let { data } = res
      if(data) { this.setState({ tdys: data })}
    })

    backend.getAllGuestTypes(res => {
      let { data } = res
      if(data) { this.setState({ guests: data })}
    })

    backend.getAllTDYTypes(res => {
      let { data } = res
      if (data) { this.setState({ purposeTypes: data }) }
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
    let upd_data = {...this.state.reservation, purpose: this.state.reservation.purposeid, numberofguests: this.state.numberofguestsid }
    backend.updateReservation(upd_data, res => {
      if (res.statusText !== 'OK') {
        NotificationManager.error('Unable to update reservation!')
        this.toggleEdit()
        return
      }

      NotificationManager.info('Updated reservation!')
    })
  }

  handleChange = (event) => {
    event.persist()
    console.log(event)
    let { target } = event
    this.setState({
      reservation: {
        ...this.state.reservation,
        [target.name]: target.value
      }
    }, () => console.log(this.state))
  }

  toggleEdit = () => {
    this.setState({ edit: !this.state.edit })
  }

  render(){
    let { data } = this.props
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
                {!this.state.edit &&
                  Object.keys(data).map(key => {
                    if (!excludedTypes.includes(key)) {
                      let name = prettyNames[key] || key
                      return <td key={key} data-title={name}>{data[key]}</td>
                    }
                  })
                }
              {this.state.edit && 
                  Object.keys(data).map(key => {
                    if (!excludedTypes.includes(key)) {
                      let name = prettyNames[key] || key
                      switch (key) {
                      case 'lengthofstay':
                      case 'lesseeemail':
                      case 'checkindate':
                      case 'checkoutdate':
                        return (
                          <td data-title={name}>
                            <span className={'border-grow'}></span>
                            <input name={key} value={this.state.reservation[key]} style={inputStyle} onChange={this.handleChange} disabled/>
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
                        return (
                          <td data-title={name}>
                            <span className={'border-grow'}></span>
                            <input name={key} value={this.state.reservation[key]} style={inputStyle} onChange={this.handleChange}/>
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
            {!this.state.edit && <ConfirmButton removeMessage={'Archive'} confirmAction={this.archiveReservation} /> }
            {this.state.edit && <ConfirmButton removeMessage={'Cancel'} confirmAction={this.toggleEdit} /> }

            {!this.state.edit && <ConfirmButton removeMessage={'Edit'} confirmAction={this.toggleEdit} style={editStyle} /> }
            {this.state.edit && <ConfirmButton removeMessage={'Save'} confirmAction={this.updateReservation} style={editStyle} /> }
          </div>

        </div>
      </div>
    )
  }
}

Info.propTypes = {
    data: PropTypes.object.isRequired,
    editable: PropTypes.bool
}

export default Info