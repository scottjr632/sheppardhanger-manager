import React from 'react'
import PropTypes, { array } from 'prop-types'

import { NotificationManager } from 'react-notifications'

import ConfirmButton from '../Buttons/confirm.jsx'
import * as backend from '../../backend'
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
      ...this.props.data,
      editable: this.props.editable || false,
      edit: false,
      bookingTypes: [],
      rooms: [],
      houses: []
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
  }

  componentWillReceiveProps(nextProps) {
    this.setState({...nextProps.data})
  }

  archiveReservation = () => {
    backend.updateReservationStatus(this.props.data.id, 'archived', (res) => {
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
    backend.updateReservation({...this.props.data}, () => {

    })
  }

  handleChange = (event) => {
    let { target } = event
    this.setState({
      [target.name]: target.value
    })
  }

  toggleEdit = () => {
    this.setState({ edit: !this.state.edit })
  }

  render(){
    let { data } = this.props
    return (
      <div className={'table'} style={{gridArea: 'right'}}>
        <div className={'table-wrapper'}>
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
                            <input name={key} value={this.state[key]} style={inputStyle} onChange={this.handleChange} disabled/>
                          </td>
                        )
                      case 'room':
                        return (
                          <td data-title={'rooms'}>
                              <select>
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
                            <select>
                              {this.state.bookingTypes.map(btype => {
                                return <option value={btype.id}>{btype.name}</option>
                              })}
                            </select>
                          </td>
                        )

                      default:
                        return <td data-title={name}><span className={'border-grow'}></span><input name={key} value={this.state[key]} style={inputStyle} onChange={this.handleChange}/></td>
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
            {this.state.edit && <ConfirmButton removeMessage={'Save'} confirmAction={this.toggleEdit} style={editStyle} /> }
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