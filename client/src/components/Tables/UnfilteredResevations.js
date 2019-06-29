import React from 'react'
import PropTypes from 'prop-types'

import { NotificationManager } from 'react-notifications'

import ExpandableRow from './ExpandableRow'
import * as backend from '../../backend'
import ConfirmButton from '../Buttons/confirm.jsx'

import { STATUS_ACTIVE, STATUS_ARCHIVED } from '../../constants'

const archiveReservation = (reservationId) => {
  backend.updateReservationStatus(reservationId, STATUS_ARCHIVED, res => {
    if (res.statusText !== 'OK') {
        NotificationManager.error('Unable to archive Reservation')
        return
      }
      
      NotificationManager.info('Archived Reservation')
  })
}

const activateReservation = (reservationId) => {
  backend.updateReservationStatus(reservationId, STATUS_ACTIVE, res => {
    if (res.statusText !== 'OK') {
      NotificationManager.error('Unable to activate Reservation')
      return
    }
    
    NotificationManager.info('Activated Reservation')
  })
}

const deleteReservation = (reservationId) => {
  if (confirm('Are you sure you want to permantly delete the Reservation?')) {
    backend.deleteReservation(reservationId, res => {
      console.log(res)
      if (res.statusText !== 'OK') {
        NotificationManager.error(res.text)
        return
      }
      NotificationManager.info('Deleted Reservation')
    })
  }
}

const formatReservation = (reservation) => {
  return {
    room: reservation.room,
    bookingtype: reservation.bookingtype,
    status: reservation.status,
    archive: reservation.status === 'archived' ?
             <ConfirmButton removeMessage={'Un-Archive'} confirmAction={() => {activateReservation(reservation.id)}} style={{backgroundColor: '#55c5b7', width: '100%'}}/> :
             <ConfirmButton removeMessage={'Archive'} confirmAction={() => {archiveReservation(reservation.id)}} style={{width: '100%'}}/>,
    delete:  <ConfirmButton removeMessage={'DELETE PERMANTLY'} confirmAction={() => {deleteReservation(reservation.id)}} style={{width: '100%'}}/>,      
    exandableInfo: `Check-in-date: ${reservation.checkindate}
                    Check-out-date: ${reservation.checkoutdate}
                    Lessee name: ${reservation.lesseelname}, ${reservation.lesseefname}
                    Lessee email: ${reservation.lesseeemail}`,
    id: reservation.id      
  }
}

class Table extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            expanded: false,
            searchCode: 'room',
            initialArray: [],
            data: [],
            sort: {
              column: null,
              direction: "asc"
            }
        }
    }

    componentWillMount(){
        backend.getAllReservationsUnfiltered(res => {
            let { data } = res
            if (data) {
                let arr = data.map(reservation => formatReservation(reservation))
                this.setState({ data: arr, initialArray: arr })
            }
        })
    }

    handleClick = () => {
        this.setState({expanded: !this.state.expanded})
    }

    search = (event) => {
      let { searchCode } = this.state
      let { target } = event
      let filter = target.value.toUpperCase()

      let _tempArray = this.state.initialArray.slice()
      let data = _tempArray.filter(value => { return value[searchCode].toUpperCase().indexOf(filter) >= 0 })

      this.setState({ data })
    }

    sort = (event, sortKey) => {
      const sortOrder = this.state.sort.direction === "asc" ? 1 : -1;
      
      let { data } = this.state
      data.sort((a, b) => {
        const val1 = a[sortKey] !== undefined ? a[sortKey].toString().toUpperCase() : ''
        const val2 = b[sortKey] !== undefined ? b[sortKey].toString().toUpperCase() : ''
        
        if (isNaN(val1) && isNaN(val2)) {
          return val1 < val2 ? -sortOrder : val1 > val2 ? sortOrder : 0;
        } else {
          return sortOrder === 1 ? val1 - val2 : val2 - val1;
        }
      })

      if (sortOrder === 1) {
        this.setState({ sort: { column: sortKey, direction: "desc" }, data });
      } else {
        this.setState({ sort: { column: sortKey, direction: "asc" }, data });
      }
    }

    setArrow = column => {
      let className;
      if (this.state.sort.column === column) {
        className = this.state.sort.direction === "asc" ? "asc" : "desc";
      }
  
      return className;
    };

    handleSelectChange = (event) => {
      this.setState({ searchCode: event.target.value })
    }

    render(){
        return (
            <div className="table-wrapper">
            <div className='input-search'>
                <i className="fas fa-search search-icon" />
                <input type="text" placeholder={'Search'} onKeyUp={this.search}/>
                <select onChange={this.handleSelectChange}>
                    <option value={'room'}>Room</option>
                    <option value={'bookingtype'}>Booking Type</option>
                    <option value={'status'}>Status</option>
                </select>
            </div>
            <table className="table-responsive card-list-table">
              <thead>
                <tr>
                  <th 
                    onClick={e => {this.sort(e, 'room')}} 
                    className={`${this.setArrow('room')} room sortable-header`}
                  >
                    Room
                  </th>
                  <th 
                    onClick={e => {this.sort(e, 'bookingtype')}} 
                    className={`${this.setArrow('bookingtype')} bookingtype sortable-header`}>
                  Booking type</th>
                  <th 
                    onClick={e => {this.sort(e, 'status ')}} 
                      className={`${this.setArrow('status')} status sortable-header`}>
                      Status</th>
                  <th 
                    onClick={e => {this.sort(e, 'rank')}} 
                    className={`${this.setArrow('rank')} rank`}>
                  Archive</th>
                  <th 
                    onClick={e => {this.sort(e, 'rank')}} 
                    className={`${this.setArrow('rank')} rank`}>
                  Delete</th>
                </tr>
              </thead>
              <tbody>
                {this.state.data.map((value, index) => {
                    return <ExpandableRow key={index} data={value} moreInfo={true} moreInfoClick={() => { this.props.moreInfo(value.id) }} moreInfoText={'More info'}/>
                  })
                }
              </tbody>
            </table>
          </div>
        )
    }
}

Table.propTypes = {
  lesseeStore: PropTypes.object
}

export default Table
