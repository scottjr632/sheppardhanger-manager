import React from 'react'

import Navi from '../components/HeaderComponents/Navbar'
import Emails from '../components/Dashboard/Emails.jsx'
import UserInfo from '../components/Dashboard/UserInfo.jsx'
import Table from '../components/Tables/Table'
import ReservationTable from '../components/Tables/Reservations'
import Question from '../components/Dashboard/Question.jsx'
import * as backend from '../backend'

const emailInfo = {
  welcome: {prettyName: 'Welcome', done: false},
  contract: {prettyName: 'Contract', done: true},
  noRooms:  {prettyName: 'No Rooms', done: true},
  reciept:  {prettyName: 'Reciept', done: true}
}

const documentsInfo = {
  masterContract: {prettyName: 'Master Contract', btnText: 'Download master contract', btnAction: () => {console.log('TETETESST')}},
  invoiceGenerator: {prettyName: 'Invoice', btnText: 'Generate invoice', btnAction: () => {console.log('TETETESST')}}
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '[left] 50% [right] 50%',
  gridTemplateRows: 'auto'
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
        if (data) this.setState({ userInfo: data, userId: id[1] })
      })
    }
  }

  render() {
    return (
      <div>
      <Navi />
        <div className={'container'} style={{...gridStyle}}>
          <div style={{gridArea: 'left', gridRow: 1}}>
            <section style={{marginBottom: '25px'}}>
              <Emails data={emailInfo} title={'EMAILS'}/>
            </section>
            <section>
              <Emails data={documentsInfo} title={'DOWNLOAD DOCUMENTS'}/>
            </section>
          </div>
          <section style={{gridArea: 'right', gridRow: 1}}>
            <UserInfo data={this.state.userInfo} history={this.props.history} />
          </section>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly'}} className={'container'}>
          <div className='table large-screen' style={{gridArea: 'tbl'}}>
            <div>
              <Question helpText={`List of all the user's reservations. Search and filter to find a specific reservation.`} />
              <label>Locate a reservation</label>
              <ReservationTable lesseeId={this.state.userId} history={this.props.history}/>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default Info