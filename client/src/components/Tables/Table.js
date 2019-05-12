import React from 'react'
import PropTypes from 'prop-types'

import { observer, inject } from 'mobx-react'

import ExpandableRow from './ExpandableRow'

@inject ('lesseeStore')
@observer
class Table extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            expanded: false,
            searchCode: 'name',
            initialArray: [],
            data: this.props.lesseeStore.formattedLessees,
            sort: {
              column: null,
              direction: "asc"
            }
        }
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.data !== this.state.data) {
        this.setState({ data: nextProps.data, initialArray: nextProps.data })
      } else if (nextProps.lesseeStore.formattedLessees !== this.state.data) {
        this.setState({ data : nextProps.lesseeStore.formattedLessees, initialArray: nextProps.lesseeStore.formattedLessees })
      }
    }

    handleClick = () => {
        this.setState({expanded: !this.state.expanded})
    }

    search = (event) => {
      let { data, searchCode, initialArray } = this.state
      let { target } = event
      let filter = target.value.toUpperCase()
      data = initialArray.filter(value => { return value[searchCode].toUpperCase().indexOf(filter) >= 0 })
      this.setState({ data })
    }

    sort(event, sortKey) {
      const sortOrder = this.state.sort.direction === "asc" ? 1 : -1;
      let { data } = this.state
      console.log(data, this.state)
      
      // sort the table
      data.sort((a, b) => {
        const val1 = a[sortKey].toString().toUpperCase();
        const val2 = b[sortKey].toString().toUpperCase();
        if (isNaN(val1) && isNaN(val2)) {
          return val1 < val2 ? -sortOrder : val1 > val2 ? sortOrder : 0;
        } else {
          return sortOrder === 1 ? val1 - val2 : val2 - val1;
        }
      });
  
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
                      Phone</th>
                  <th 
                    onClick={e => {this.sort(e, 'rank')}} 
                    className={`${this.setArrow('rank')} rank sortable-header`}>
                  Rank</th>
                  <th 
                    onClick={e => {this.sort(e, 'reservation')}} 
                    className={`${this.setArrow('reservation')} reservation sortable-header`}
                  >
                  Reservation
                  </th>
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
