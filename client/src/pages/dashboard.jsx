import React from 'react'

import Navi from '../components/HeaderComponents/Navbar'
import Schedule from '../components/charts/scheduler'
import NewLesseeModal from '../components/Modals/NewLesseeModal'
import AccessDenied from '../components/Errors/AccessDenied'
import Table from '../components/Tables/Table'
import Question from '../components/Dashboard/Question.jsx'
import * as backend from '../backend'


class Dashboard extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      lessees: []
    }
  }

  componentDidMount() {
    this.formatLessees()
  }

  toggleModal = () => {
    this.setState({showModal: !this.state.showModal})
  }

  moreInfo = (id) => {
    this.props.history.push(`/info?id=${id}`)
  }

  formatLessees = () => {
    backend.getAllLessees(res => {
      let { data } = res
      if (data) {
        let result = []
        data.forEach(value => {
          result.push({
            name: `${value.lname}, ${value.fname}`,
            email: value.email,
            phone: value.phone || '',
            rank: value.rank || '',
            reservations: value.reservations && value.reservations.length > 0 
                          ? `${value.reservations[0].room} - ${value.reservations[0].checkindate}` 
                          : '',
            exandableInfo: `Address: ${value.address}
              City: ${value.city}
              State: ${value.state}
              Notes: ${value.notes}`,
              id: value.id,
          })
        })
        this.setState({lessees: result})
      } 
    })
  }

  render(){
    return (
      <div>
        <Navi />
        <Schedule />
        {/* <Question helpText={'Search to find a lessee. Click on their name to get more information or click on headers to sort.'} /> */}
        <div className={'grid-container'}>
          <div className='table large-screen' style={{gridArea: 'tbl'}}>
            <div>
              <Question helpText={'Search to find a lessee. Click on their name to get more information or click on headers to sort.'} />
              <label>Locate a lessee</label>
              <Table data={this.state.lessees} moreInfo={this.moreInfo}/>
            </div>
          </div>
        </div>
        <div style={{gridArea: 'btns', display: 'flex', flexDirection: 'column', position: 'fixed', top: '75%', zIndex: 99}}>
          <button className={'btn__new minimized'} style={{overflow: 'hidden'}} onClick={this.toggleModal}>+ Create new lessee</button>
          <button className={'btn__new minimized'} style={{overflow: 'hidden'}} onClick={this.toggleModal}>+ Add to calendar</button>
        </div>

        <NewLesseeModal showModal={this.state.showModal} closeModal={this.toggleModal}/>
        <AccessDenied history={this.props.history} />
      </div>
    )
  }
}

export default Dashboard