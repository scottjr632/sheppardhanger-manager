import React from 'react'

import Navi from '../components/HeaderComponents/Navbar'
import Emails from '../components/Dashboard/Emails.jsx'
import UserInfo from '../components/Dashboard/UserInfo.jsx'
import Table from '../components/Tables/Table'
import Question from '../components/Dashboard/Question.jsx'
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

class Info extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      userId: 0,
      userInfo: {},
    }
  }

  componentDidMount() {
    let { search } = this.props.location
    if (search && search.length > 1) {
      let id = search.match(/=(.*)/)
      if (id[1]) backend.getLesseeById(id[1], (res) => {
        let { data } = res
        if (data) this.setState({userInfo: data}, () => console.log(this.state.userInfo, 'state info'))
      })
    }
    // this.setState({userInfo : testUserInfo})
  }

  render() {
    return (
      <div>
      <Navi />
        <div className={'container'} style={{...gridStyle}}>
          <section style={{gridArea: 'left'}}>
            <Emails data={emailTestInfo} />
          </section>
          <section style={{gridArea: 'right'}}>
            <UserInfo data={this.state.userInfo} history={this.props.history} />
          </section>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly'}}>
        <div className='table large-screen' style={{gridArea: 'tbl'}}>
            <div>
              <Question helpText={'Search to find a lessee. Click on their name to get more information or click on headers to sort.'} />
              <label>Locate a lessee</label>
              <Table moreInfo={this.moreInfo}/>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default Info