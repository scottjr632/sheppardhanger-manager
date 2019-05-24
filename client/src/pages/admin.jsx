import React, { Suspense, lazy } from 'react'

import { inject, observer } from 'mobx-react'

import Navi from '../components/HeaderComponents/Navbar'
import AccessDenied from '../components/Errors/AccessDenied'
import Unfiltered from '../components/Tables/Unfiltered'
import UnfilteredReservations from '../components/Tables/UnfilteredResevations'
import Question from '../components/Dashboard/Question.jsx'

const gridLayout = {
  display: 'grid',
  gridTemplateColumns: '[pad] 5% [tbl] 45% [tbl2] 45% [pad2] 5%'
}

@inject ('lesseeStore')
@observer
class Admin extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      showEventModal: false,
      newEventStart: undefined,
      newEventStop: undefined,
      lessees: []
    }
  }

  componentDidMount() {
    // this.props.lesseeStore.populateLessees()
  }

  setNewEventStartAndStop = (newEventStart, newEventStop) => {
    this.setState({ newEventStart, newEventStop })
  }

  setNewEventStart = (newEventStart) => {
    this.setState({ newEventStart })
  }

  setNewEventStop = (newEventStop) => {
    this.setState({ newEventStop })
  }

  toggleModal = () => {
    this.setState({showModal: !this.state.showModal})
  }

  toggleEventModal = () => {
    this.setState({ showEventModal: !this.state.showEventModal })
  }

  moreInfo = (id) => {
    this.props.history.push(`/info?id=${id}`)
  }

  render(){
    return (
      <div style={{marginBottom: '100px'}}>
        <Navi />
        <div className={'grid-container__dual'}>
          <div className='table large-screen' style={{gridArea: 'tbl', marginRight: '6px'}}>
            <div>
              <Question helpText={'Search to find a lessee. Click on their name to get more information or click on headers to sort.'} />
              <label>Unfiltered Lessees</label>
              <Unfiltered moreInfo={this.moreInfo} />
            </div>
          </div>
          <div className='table large-screen' style={{gridArea: 'tbl2', marginLeft: '6px'}}>
            <div>
              <Question helpText={'Search to find a lessee. Click on their name to get more information or click on headers to sort.'} />
              <label>Unfiltered Reservations</label>
              <UnfilteredReservations moreInfo={this.moreInfo} />
            </div>
          </div>
        </div>

        <AccessDenied history={this.props.history} />
      </div>
    )
  }
}

export default Admin