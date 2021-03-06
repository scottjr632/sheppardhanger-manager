import React, { Suspense, lazy } from 'react'

import { inject, observer } from 'mobx-react'

import Navi from '../components/HeaderComponents/Navbar'
// import Schedule from '../components/charts/scheduler'
import Schedule from '../loadables/LoadableSchedule.jsx'
import NewLesseeModal from '../loadables/NewLesseeModal.jsx'
import NewCalendarEvent from '../loadables/NewCalendarEvent.jsx'
import AccessDenied from '../components/Errors/AccessDenied'
import Table from '../loadables/LoadableTable.jsx'
import Question from '../components/Dashboard/Question.jsx'

@inject ('lesseeStore')
@observer
class Dashboard extends React.Component {

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
    this.props.lesseeStore.populateLessees()
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
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <Schedule history={this.props.history} showCreateEventModal={this.toggleEventModal} setNewEventStartAndStop={this.setNewEventStartAndStop} />
          <a style={{cursor: 'pointer', alignSelf: 'flex-end', marginRight: '20px'}} href='/api/v1/protected/reservations/excel'>Download calendar</a>
        </div>
        {/* <Question helpText={'Search to find a lessee. Click on their name to get more information or click on headers to sort.'} /> */}
        <div className={'grid-container'}>
          <div className='table large-screen' style={{gridArea: 'tbl'}}>
            <div>
              <Question helpText={'Search to find a lessee. Click on their name to get more information or click on headers to sort.'} />
              <label>Locate a lessee</label>
              <Table moreInfo={this.moreInfo}/>
            </div>
          </div>
        </div>
        <div style={{gridArea: 'btns', display: 'flex', flexDirection: 'column', position: 'fixed', top: '75%', zIndex: 99}}>
          <button className={'btn__new minimized'} style={{overflow: 'hidden'}} onClick={this.toggleModal}>+ Create new lessee</button>
          <button className={'btn__new minimized'} style={{overflow: 'hidden'}} onClick={this.toggleEventModal}>+ Add to calendar</button>
        </div>

        <NewLesseeModal showModal={this.state.showModal} closeModal={this.toggleModal}/>
        <NewCalendarEvent showModal={this.state.showEventModal} closeModal={this.toggleEventModal} eventStart={this.state.newEventStart} eventStop={this.newEventStop}/>
        <AccessDenied history={this.props.history} />
      </div>
    )
  }
}

export default Dashboard