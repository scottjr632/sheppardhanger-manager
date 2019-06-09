import React, { Suspense, lazy } from 'react'

import { inject, observer } from 'mobx-react'

import Navi from '../components/HeaderComponents/Navbar'
import AccessDenied from '../components/Errors/AccessDenied'
import Unfiltered from '../components/Tables/Unfiltered'
import UnfilteredReservations from '../components/Tables/UnfilteredResevations'
import Question from '../components/Dashboard/Question.jsx'
import NewUser from '../components/Dashboard/NewUser.jsx'
import EditEmailTemplates from '../components/Dashboard/EditEmailTemplates.jsx'


@inject ('lesseeStore')
@observer
class Admin extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      showAdmin: false,
      editEmailTemplates: false,
      showEventModal: false,
      newEventStart: undefined,
      newEventStop: undefined,
      lessees: []
    }
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

  toggleNewAdmin = () => {
    this.setState({
      showAdmin: !this.state.showAdmin
    })
  }

  toggleEditEmailTemplates = () => {
    this.setState({ editEmailTemplates: !this.state.editEmailTemplates })
  }

  toggleEventModal = () => {
    this.setState({ showEventModal: !this.state.showEventModal })
  }

  moreInfo = (lesseeId) => {
    this.props.history.push(`/info?id=${lesseeId}`)
  }

  moreInfoReservation = (reservationId) => {
    this.props.history.push(`/reservation?id=${reservationId}`)
  }

  render(){
    return (
      <div style={{marginBottom: '100px'}}>
        <Navi />
        {!this.state.showAdmin && !this.state.editEmailTemplates && 
        <span style={{display: 'flex', justifyContent: 'flex-end', marginRight: '5%'}}>
          <button className={'btn__new'} onClick={this.toggleEditEmailTemplates}>Edit email templates</button>
          <button className={'btn__new'} onClick={()=>{}}>Edit room names</button>
          <button className={'btn__new'} onClick={this.toggleNewAdmin}>Create new admin user</button>
        </span>}
        {this.state.showAdmin && <NewUser toggleAdmin={this.toggleNewAdmin} /> }
        {this.state.editEmailTemplates && 
          <div style={{display: 'flex', flexDirection: 'column', paddingTop: '5vh'}}>
           <EditEmailTemplates toggle={this.toggleEditEmailTemplates}/>
          </div>
        }
        {!this.state.editEmailTemplates &&
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
              <UnfilteredReservations moreInfo={this.moreInfoReservation} />
            </div>
          </div>
        </div>}

        <AccessDenied history={this.props.history} />
      </div>
    )
  }
}

export default Admin