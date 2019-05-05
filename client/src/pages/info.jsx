import React from 'react'

import Navi from '../components/HeaderComponents/Navbar'
import Emails from '../components/Dashboard/Emails.jsx'
import UserInfo from '../components/Dashboard/UserInfo.jsx'

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

class Info extends React.Component {

  render() {
    return (
      <div>
      <Navi />
      <div className={'container'} style={{...gridStyle}}>
          <section style={{gridArea: 'left'}}>
            <Emails data={emailTestInfo} />
          </section>
          <section style={{gridArea: 'right'}}>
            <UserInfo data={testUserInfo} />
          </section>
        </div>
      </div>
    )
  }

}

export default Info