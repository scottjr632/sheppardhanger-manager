import React from 'react'

import Navi from '../components/HeaderComponents/Navbar'
import Schedule from '../components/charts/scheduler'
import NewLesseeModal from '../components/Modals/NewLesseeModal'
import AccessDenied from '../components/Errors/AccessDenied'
import Table from '../components/Tables/Table'


class Dashboard extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showModal: false
    }
  }

  toggleModal = () => {
    console.log('clicked')
    this.setState({showModal: !this.state.showModal})
  }

  render(){
    return (
      <div>
        <Navi />
        <Schedule />
        <div className={'grid-container'}>
          <div className='table large-screen' style={{gridArea: 'tbl'}}>
            <div>
              <label>Locate a lessee</label>
              <Table />
            </div>
          </div>
        </div>
        <div style={{gridArea: 'btns', display: 'flex', flexDirection: 'column', position: 'fixed', top: '80%'}}>
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