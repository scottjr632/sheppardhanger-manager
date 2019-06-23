import React from 'react'

import Navi from '../components/HeaderComponents/Navbar'
import Emails from '../components/Dashboard/Emails.jsx'
import Info from '../components/Dashboard/ReservationInfo.jsx'
import * as backend from '../backend'

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '[left] 50% [right] 50%'
}

class ReservationInfoPage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      userId: 0,
      reservationInfo: {},
      editing: false,
    }
  }

  componentDidMount() {
    let { search } = this.props.location
    if (search && search.length > 1) {
      let id = search.match(/=(.[0-9])/)
      let edit = search.match(/edit=(.)?/)
      let shouldEdit = (edit && edit[1] && (edit[1] == 1))
      if (id[1]) {
        backend.getReservationById(id[1], (res) => {
          let { data } = res
          if (data) this.setState({reservationInfo: data, editing: shouldEdit})
        })
      }
    }
  }

  toggleEdit = () => {
    this.setState({editing: !this.state.editing})
  }

  render() {
    return (
      <div>
      <Navi />
        <div className={'container'} >
            <Info data={this.state.reservationInfo} editing={this.state.editing} toggleEdit={this.toggleEdit} history={this.props.history}/>
        </div>
      </div>
    )
  }

}

export default ReservationInfoPage