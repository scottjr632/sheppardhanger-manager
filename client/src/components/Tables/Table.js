import React from 'react'
import PropTypes from 'prop-types'

import ExpandableRow from './ExpandableRow'


const TESTDATA = [
  {'a': 1, 'b': 2, 'c': 3, 'd': 4, 'f': 5, 'exandableInfo': ''},
  {'a': 2, 'b': 2, 'c': 3, 'd': 4, 'f': 5, 'exandableInfo': 'TESTSETESTEST'},
  {'a': 2, 'b': 2, 'c': 3, 'd': 4, 'f': 5, 'exandableInfo': 'TESTSETESTEST'},
  {'a': 2, 'b': 2, 'c': 3, 'd': 4, 'f': 5, 'exandableInfo': 'TESTSETESTEST'},
  {'a': 2, 'b': 2, 'c': 3, 'd': 4, 'f': 5, 'exandableInfo': 'TESTSETESTEST'},
  {'a': 2, 'b': 2, 'c': 3, 'd': 4, 'f': 5, 'exandableInfo': 'TESTSETESTEST'},
]

class Table extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            expanded: false
        }
    }

    handleClick = () => {
        this.setState({expanded: !this.state.expanded})
    }

    render(){
        return (
        <div class="table-wrapper">
            <div className='input-search'>
                <i class="fas fa-search search-icon"></i>
                <input type="text" placeholder={'Search'}/>
                <select>
                    <option>Name</option>
                    <option>Email</option>
                    <option>Phone</option>
                    <option>Rank</option>
                    <option>Reservation</option>
                </select>
            </div>
            <table class="table-responsive card-list-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Rank</th>
                  <th>Reservation</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.props.data.map(value => {
                    return <ExpandableRow data={value} />
                  })
                }

              </tbody>
            </table>
          </div>
        )
    }
}

export default Table
