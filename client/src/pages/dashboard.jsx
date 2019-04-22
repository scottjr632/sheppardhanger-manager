import React from 'react'

import Navi from '../components/HeaderComponents/Navbar'
import Schedule from '../components/charts/scheduler'
import NewLesseeModal from '../components/Modals/NewLesseeModal'
import AccessDenied from '../components/Errors/AccessDenied'


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
        <button className={'pull-right btn__new lessee'} onClick={this.toggleModal}>Create new lessee</button>
        <button className={'pull-right btn__new'} onClick={this.toggleModal}>Add to calendar</button>
        <NewLesseeModal showModal={this.state.showModal} closeModal={this.toggleModal}/>
        <div className={'container'}>
            <div style={{fontSize: '18pt'}}>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </div>
            <div style={{fontSize: '18pt'}}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </div>
            <div style={{fontSize: '18pt'}}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </div>        <div style={{fontSize: '18pt'}}>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </div>
        </div>

        <AccessDenied history={this.props.history} />
      </div>
    )
  }
}

export default Dashboard