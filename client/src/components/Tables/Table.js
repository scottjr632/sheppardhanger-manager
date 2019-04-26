import React from 'react'
import SubTable from './SubTable'


class Table extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            expanded: false
        }
    }

    handleClick = () => {
        console.log('stuff')
        this.setState({expanded: !this.state.expanded})
    }

    render(){
        return (
        <div class="table-wrapper">
            <div className='input-search'>
                <i class="fas fa-search search-icon"></i>
                <input type="text" placeholder={'Search'}/>
                <select>
                    <option>TEST</option>
                    <option>TEST</option>
                    <option>TEST</option>
                    <option>TEST</option>
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
                <tr onClick={this.handleClick}>
                  <td data-title="Column #1"><i className={`fas fa-plus ${this.state.expanded ? 'rotated' : ''}`}></i>Value #1</td>
                  <td data-title="Column #2">Value #2</td>
                  <td data-title="Column #3">Value #3</td>
                  <td data-title="Column #4">Value #4</td>
                  <td data-title="Column #5">Value #5</td>
                </tr>
                <tr>
                    <SubTable expanded={this.state.expanded} />
                </tr>
                <tr>
                  <td data-title="Column #1">Value #1</td>
                  <td data-title="Column #2">Value #2</td>
                  <td data-title="Column #3">Value #3</td>
                  <td data-title="Column #4">Value #4</td>
                  <td data-title="Column #5">Value #5</td>
                </tr>
                <tr>
                <SubTable expanded={this.state.expanded} />
                    
                </tr>
                <tr>
                  <td data-title="Column #1">Value #1</td>
                  <td data-title="Column #2">Value #2</td>
                  <td data-title="Column #3">Value #3</td>
                  <td data-title="Column #4">Value #4</td>
                  <td data-title="Column #5">Value #5</td>
                </tr>
                <tr>
                  <td data-title="Column #1">Value #1</td>
                  <td data-title="Column #2">Value #2</td>
                  <td data-title="Column #3">Value #3</td>
                  <td data-title="Column #4">Value #4</td>
                  <td data-title="Column #5">Value #5</td>
                </tr>
                <tr>
                  <td data-title="Column #1">Value #1</td>
                  <td data-title="Column #2">Value #2</td>
                  <td data-title="Column #3">Value #3</td>
                  <td data-title="Column #4">Value #4</td>
                  <td data-title="Column #5">Value #5</td>
                </tr>
                <tr>
                  <td data-title="Column #1">Value #1</td>
                  <td data-title="Column #2">Value #2</td>
                  <td data-title="Column #3">Value #3</td>
                  <td data-title="Column #4">Value #4</td>
                  <td data-title="Column #5">Value #5</td>
                </tr>
                <tr>
                  <td data-title="Column #1">Value #1</td>
                  <td data-title="Column #2">Value #2</td>
                  <td data-title="Column #3">Value #3</td>
                  <td data-title="Column #4">Value #4</td>
                  <td data-title="Column #5">Value #5</td>
                </tr>
                <tr>
                  <td data-title="Column #1">Value #1</td>
                  <td data-title="Column #2">Value #2</td>
                  <td data-title="Column #3">Value #3</td>
                  <td data-title="Column #4">Value #4</td>
                  <td data-title="Column #5">Value #5</td>
                </tr>
                <tr>
                  <td data-title="Column #1">Value #1</td>
                  <td data-title="Column #2">Value #2</td>
                  <td data-title="Column #3">Value #3</td>
                  <td data-title="Column #4">Value #4</td>
                  <td data-title="Column #5">Value #5</td>
                </tr>
                <tr>
                  <td data-title="Column #1">Value #1</td>
                  <td data-title="Column #2">Value #2</td>
                  <td data-title="Column #3">Value #3</td>
                  <td data-title="Column #4">Value #4</td>
                  <td data-title="Column #5">Value #5</td>
                </tr>
                <tr>
                  <td data-title="Column #1">Value #1</td>
                  <td data-title="Column #2">Value #2</td>
                  <td data-title="Column #3">Value #3</td>
                  <td data-title="Column #4">Value #4</td>
                  <td data-title="Column #5">Value #5</td>
                </tr>
                <tr>
                  <td data-title="Column #1">Value #1</td>
                  <td data-title="Column #2">Value #2</td>
                  <td data-title="Column #3">Value #3</td>
                  <td data-title="Column #4">Value #4</td>
                  <td data-title="Column #5">Value #5</td>
                </tr>
                <tr>
                  <td data-title="Column #1">Value #1</td>
                  <td data-title="Column #2">Value #2</td>
                  <td data-title="Column #3">Value #3</td>
                  <td data-title="Column #4">Value #4</td>
                  <td data-title="Column #5">Value #5</td>
                </tr>
              </tbody>
            </table>
          </div>
        )
    }
}

export default Table
