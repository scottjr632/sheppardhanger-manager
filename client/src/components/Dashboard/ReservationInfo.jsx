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
  'numberofguests' : 'Guests'
}

class Info extends React.Component {

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
                {this.state.edit && <div></div>}
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

Info.propTypes = {
    data: PropTypes.object.isRequired,
    editable: PropTypes.bool
}

export default Info