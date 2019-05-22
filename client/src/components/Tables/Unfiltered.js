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

const formatLessee = (lessee) => {
  return  {
     name: `${lessee.lname}, ${lessee.fname}`,
     email: lessee.email,
     archived: lessee.status,
     archive: lessee.status === 'archived' ? 
             <button className={'btn__new small'}>Un-Archive</button> :
             <button className={'btn__new small dangerous'}>Archive</button>,
     delete: <button className={'btn__new dangerous small'}>Permantly Delete</button>,      
     exandableInfo: `Address: ${lessee.address}
               City: ${lessee.city}
               State: ${lessee.state}
               Notes: ${lessee.notes}`,
     id: lessee.id,
   }
 }

class Table extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            expanded: false,
            searchCode: 'name',
            initialArray: [],
            data: [],
            sort: {
              column: null,
              direction: "asc"
            }
        }
    }

    componentWillMount(){
        backend.getAllLesseesUnfiltered(res => {
            let { data } = res
            if (data) {
                let arr = data.map(lessee => formatLessee(lessee))
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
            <div className="table-wrapper">
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
                    onClick={e => {this.sort(e, 'name')}} 
                    className={`${this.setArrow('name')} name sortable-header`}
                  >
                    Name
                  </th>
                  <th 
                    onClick={e => {this.sort(e, 'email')}} 
                    className={`${this.setArrow('email')} email sortable-header`}>
                  Email</th>
                  <th 
                    onClick={e => {this.sort(e, 'phone')}} 
                      className={`${this.setArrow('phone')} phone sortable-header`}>
                      Status</th>
                  <th 
                    onClick={e => {this.sort(e, 'rank')}} 
                    className={`${this.setArrow('rank')} rank sortable-header`}>
                  Delete</th>
                  <th 
                    onClick={e => {this.sort(e, 'rank')}} 
                    className={`${this.setArrow('rank')} rank sortable-header`}>
                  Archive</th>
                </tr>
              </thead>
              <tbody>
                {this.state.data.map((value, index) => {
                    return <ExpandableRow key={index} data={value} moreInfo={true} moreInfoClick={() => { this.props.moreInfo(value.id) }}/>
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
