import React from 'react'
import PropTypes from 'prop-types'

import ExpandableRow from './ExpandableRow'
import * as backend from '../../backend'

const formatReservation = (reservation) => {
  return {
    house: reservation.house,
    room: reservation.room,
    lengthofstay: reservation.lengthofstay,
    checkindate: reservation.checkindate,
    checkoutdate: reservation.checkoutdate
  }
}

class Table extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            expanded: false,
            searchCode: 'name',
            initialArray: [],
            lesseeId: 0,
            data: [],
            sort: {
              column: null,
              direction: "asc"
            }
        }
    }

    componentWillReceiveProps(nextProps) {
      if (parseInt(nextProps.lesseeId) !== parseInt(this.state.lesseeId)) {
        backend.getReservationsByLesseeId(nextProps.lesseeId, res => {
          let { data } = res
          if (data) {
            data = data.length && data.length > 0 ? data : [data]
            let formatted = []
        
            data.forEach(res => {
              formatted.push(formatReservation(res))
            })
            this.setState({ data: formatted, lesseeId: parseInt(nextProps.lesseeId) })
          }
        })
      }
    }

    handleClick = () => {
        this.setState({expanded: !this.state.expanded})
    }

    search = (event) => {
      let { searchCode } = this.state
      let { target } = event
      let filter = target.value.toUpperCase()

      this.props.lesseeStore.searchformattedLessees(filter, searchCode)
    }

    sort = (event, sortKey) => {
      const sortOrder = this.state.sort.direction === "asc" ? 1 : -1;
      
      this.props.lesseeStore.sortFormattedLessees(sortKey, sortOrder)
      if (sortOrder === 1) {
        this.setState({ sort: { column: sortKey, direction: "desc" } });
      } else {
        this.setState({ sort: { column: sortKey, direction: "asc" } });
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
        <div className="table-wrapper full">
            <div className='input-search'>
                <i className="fas fa-search search-icon" />
                <input type="text" placeholder={'Search'} onKeyUp={this.search}/>
                <select onChange={this.handleSelectChange}>
                    <option value={'name'}>Name</option>
                    <option value={'email'}>Email</option>
                    <option value={'phone'}>Phone</option>
                    <option value={'rank'}>Rank</option>
                    <option value={'reservation'}>Reservation</option>
                </select>
            </div>
            <table className="table-responsive card-list-table">
              <thead>
                <tr>
                  <th 
                    onClick={e => {this.sort(e, 'house')}} 
                    className={`${this.setArrow('house')} house sortable-header`}
                  >
                    House
                  </th>
                  <th 
                    onClick={e => {this.sort(e, 'room')}} 
                    className={`${this.setArrow('room')} room sortable-header`}>
                  Room</th>
                  <th 
                    onClick={e => {this.sort(e, 'lengthofstay')}} 
                      className={`${this.setArrow('lengthofstay')} lengthofstay sortable-header`}>
                      Nights</th>
                  <th 
                    onClick={e => {this.sort(e, 'checkindate')}} 
                    className={`${this.setArrow('checkindate')} checkindate sortable-header`}>
                  Check-in</th>
                  <th 
                    onClick={e => {this.sort(e, 'checkoutdate')}} 
                    className={`${this.setArrow('checkoutdate')} checkoutdate sortable-header`}
                  >
                  Check-out
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.state.data.map((value, index) => {
                  return (
                    <tr key={index}>
                      {Object.keys(value).map(key => {
                        return <td data-title={key}>{value[key]}</td>
                      })}
                    </tr>
                  )
                })}
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
