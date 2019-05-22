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

const saveStyle = {
  backgroundColor: '#12e96f'
}

// const disabledBtn = {
//   backgroundColor: '#b9b9b9',
//   cursor: 'default'
// }

const excludedTypes = [
  'id'
]

const prettyNames = {
  'bookingtype' : 'Booking type',
  'checkindate' : 'Check-in-date',
  'checkoutdate' : 'Check-out-date',
  'lesseeemail' : 'Email', 
  'fname' : 'First name', 
  'lname' : 'Last name', 
  'numberofguests' : 'Guests'
}

@inject('lesseeStore')
@observer
class UserInfo extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      ...this.props.data,
      editable: this.props.editable || false,
      edit: false,
      bookingTypes: [],
      ranks: [],
      activeRankId: 1
    }
  }

  componentWillMount(){
    if (this.state.bookingTypes.length === 0) {
      backend.getAllBookingTypes((res) => {
        let { data } = res
        if (data) this.setState({ bookingTypes: data }) 
      })
    }
  }

  componentDidMount() {
    backend.getAllRanks(res => {
      let { data } = res
      if (data) { 
        let activeRank = data.find(elem => elem.name == this.props.data.rank)
        this.setState({ranks: data, activeRankId: activeRank ? activeRank.id : 1})
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({...nextProps.data})
  }

  archiveUser = () => {
    backend.updateLesseeStatus(this.props.data.id, 'archived', (res) => {
      let { data } = res
      if (data) {
        if (res.status !== 200) {
          NotificationManager.error(data)
        } else {
          this.props.lesseeStore.removeLessee({id: this.props.data.id})
          NotificationManager.info(data)
        }
      } else {
        NotificationManager.error('Unable to update user status!')
      }
    })
  }

  updateUser = () => {
    backend.updateLessee({...this.state, rank: this.state.activeRankId}, (res) => {
      if (res.status !== 200) {
        NotificationManager.error('Unable to update lessee')
      }
      NotificationManager.info('Updated lessee information')
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

  goToReservationInfo = (reservtionId) => {
    this.props.history.push(`/reservation?id=${reservtionId}`)
  }

  render(){
    let { data } = this.props
    return (
      <div className={'table'} style={{gridArea: 'right'}}>
        <div className={'table-wrapper'}>
          <table className="table-responsive card-list-table">
            <thead>
              <tr>
                { Object.keys(data).map(key => { return <th key={key}>{key}</th> }) }
              </tr>
            </thead>
            <tbody>
              <tr>
                {!this.state.edit &&
                  Object.keys(data).map(key => {
                    if (!excludedTypes.includes(key)) {
                      let name = prettyNames[key] || key
                      return key === 'reservations' ?
                      <React.Fragment>
                        <td data-title={'RES STATUS'} key={key} onClick={() => {this.goToReservationInfo(data[key][0].id || 0)}}>{ data[key].length > 0 ? data[key][0].bookingtype : ''}<i className="fas fa-external-link-alt" style={{margin: '0 0 0 10px'}}></i></td>  
                        <td data-title={'ROOM'} key={key} onClick={() => {this.goToReservationInfo(data[key][0].id || 0)}}>{ data[key].length > 0 ? data[key][0].room : ''}</td>
                      </React.Fragment> : 
                      <td data-title={name} key={key}>{this.state[key]}</td>
                    }
                  })
                }
                {this.state.edit && 
                  Object.keys(data).map(key => {
                    if (!excludedTypes.includes(key)) {
                      let name = prettyNames[key] || key
                      switch (key) {
                      case 'reservations':
                        return (
                            <td data-title={'RES STATUS'} className="tooltip" >
                              <span className="tooltiptext">Click on the reservation to change status</span>
                              <select value={ data[key].length > 0 ? data[key][0].bookingtypeid : 0} name={key} style={{cursor: 'not-allowed'}} disabled>
                                <option value={0}>-- NONE --</option>
                                {this.state.bookingTypes.map(btype => {
                                  return <option value={btype.id}>{btype.name}</option>
                                })}
                              </select>
                            </td>
                        )
                      case 'rank':
                        return (
                          <td data-title={'rank'}>
                            <select name={'activeRankId'} onChange={this.handleChange} value={this.state.activeRankId}>
                              <option value={0}>-- NONE --</option>
                              {this.state.ranks.map(btype => {
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
            {!this.state.edit && <ConfirmButton removeMessage={'Archive'} confirmAction={this.archiveUser} disabled={this.state.status === 'archived'} /> }
            {this.state.edit && <ConfirmButton removeMessage={'Cancel'} confirmAction={this.toggleEdit} /> }

            {!this.state.edit && <ConfirmButton removeMessage={'Edit'} confirmAction={this.toggleEdit} style={editStyle} /> }
            {this.state.edit && <ConfirmButton removeMessage={'Save'} confirmAction={() => { this.updateUser(); this.toggleEdit(); }} style={saveStyle} /> }
          </div>
        </div>
      </div>
    )
  }
}

UserInfo.propTypes = {
    data: PropTypes.object.isRequired,
    editable: PropTypes.bool
}

export default UserInfo