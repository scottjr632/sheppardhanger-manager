import React from 'react'
import PropTypes, { array } from 'prop-types'

import ConfirmButton from '../Buttons/confirm.jsx'
import * as backend from '../../backend'

const inputStyle = {
  borderBottom: '1pt #d8d5d5 solid'
}

const editStyle = {
  backgroundColor: '#128de9'
}

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

class UserInfo extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      ...this.props.data,
      editable: this.props.editable || false,
      edit: false,
      bookingTypes: []
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

  componentWillReceiveProps(nextProps) {
    this.setState({...nextProps.data})
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
                      <td data-title={'RES STATUS'} key={key}>{ data[key].length > 0 ? data[key][0].bookingtype : ''}</td>:
                      <td data-title={name} key={key}>{data[key]}</td>
                    }
                  })
                }
                {this.state.edit && 
                  Object.keys(data).map(key => {
                    if (!excludedTypes.includes(key)) {
                      let name = prettyNames[key] || key
                      return key === 'reservations' ?
                      <td data-title={'RES STATUS'}>
                        <select value={ data[key].length > 0 ? data[key][0].bookingtypeid : 0} name={key}>
                          <option value={0}>-- NONE --</option>
                          {this.state.bookingTypes.map(btype => {
                            return <option value={btype.id}>{btype.name}</option>
                          })}
                        </select>
                      </td> :
                      <td data-title={name}><span className={'border-grow'}></span><input name={key} value={this.state[key]} style={inputStyle} onChange={this.handleChange}/></td>
                    }
                  })
                }
              </tr>
            </tbody>
          </table>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', margin: '10px 0 10px 0'}}>
            <ConfirmButton removeMessage={'Archive'} confirmAction={()=>{}} />
            {!this.state.edit && <ConfirmButton removeMessage={'Edit'} confirmAction={this.toggleEdit} style={editStyle} /> }
            {this.state.edit && <ConfirmButton removeMessage={'Save'} confirmAction={this.toggleEdit} style={editStyle} /> }
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