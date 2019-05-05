import React from 'react'

import Navi from '../components/HeaderComponents/Navbar'
import Emails from '../components/Dashboard/Emails.jsx'

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

class Info extends React.Component {

  render() {
    return (
      <div>
      <Navi />
      <div className={'container'} style={{display: 'flex', flexDirection: 'row'}}>
          {/* EMAIL SECTION */}
          <Emails data={emailTestInfo} />
          {/* User info section */}
          {/* EMAIL SECTION */}
          <div style={{position: 'relative', width: '50%', fontStyle: '13pt'}}>
          </div>
        </div>
      </div>
    )
  }

}

export default Info