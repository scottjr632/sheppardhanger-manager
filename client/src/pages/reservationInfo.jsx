import React from 'react'

import Navi from '../components/HeaderComponents/Navbar'
import Emails from '../components/Dashboard/Emails.jsx'
import Info from '../components/Dashboard/ReservationInfo.jsx'
import * as backend from '../backend'

const emailTestInfo = {
  welcome: {prettyName: 'Welcome', done: false},
  contract: {prettyName: 'Contract', done: true},
  noRooms:  {prettyName: 'No Rooms', done: true},
  reciept:  {prettyName: 'Reciept', done: true}
}
const testUserInfo = {
    name: 'TEST, User', 
    reservation: 'Ressee',
    checkInDate: '11-11-11',
    checkOutDate: '11-11-11',
    email: 'test@test.com',
    address: '1111111 no str',
    city: 'no name pl',
    state: 'tx',
    zipcode: '999999',
}

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
    }
  }

  componentDidMount() {
    let { search } = this.props.location
    if (search && search.length > 1) {
      let id = search.match(/=(.*)/)
      if (id[1]) backend.getReservationById(id[1], (res) => {
        let { data } = res
        if (data) this.setState({reservationInfo: data}, () => console.log(this.state.reservationInfo, 'state info'))
      })
    }
  }

  render() {
    return (
      <div>
      <Navi />
        <div className={'container'} style={{...gridStyle}}>
          <section style={{gridArea: 'left'}}>
            {/* <Emails data={emailTestInfo} /> */}
          </section>
          <section style={{gridArea: 'right'}}>
            <Info data={this.state.reservationInfo} />
          </section>
        </div>
      </div>
    )
  }

}

export default ReservationInfoPage