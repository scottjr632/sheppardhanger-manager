import React from 'react'
import Modal from 'react-modal'
import PropTypes from 'prop-types'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { NotificationManager } from 'react-notifications'

import 'react-day-picker/lib/style.css';


Modal.setAppElement('#root')

const customStyles = {
  content : {
    // top                   : '50%',
    // left                  : '50%',
    // right                 : 'auto',
    // bottom                : 'auto',
    // marginRight           : '-50%',
    // transform             : 'translate(-50%, -50%)'
  },
  overlay : {
    zIndex: 9999999
  }
};


class NewLesseeModal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      checkInDate: undefined,
      checkOutDate: undefined,
      isCheckInEmpty: true,
      isCheckOutEmpty: true,
      firstName: '',
      lastName: ''
    }
  }

  createNewLessee = () => {
    NotificationManager.info(`Create new lessee: ${this.state.lastName}, ${this.state.firstName} `)
    this.setState({
      firstName: '',
      lastName: ''
    })
    this.props.closeModal()
  }

  handleChange = (event) => {
    let { target } = event
    this.setState({
      [target.name]: target.value
    })
  }

  render() {
    return (
      <div>
        <Modal
          isOpen={this.props.showModal}
          contentLabel="New Lessee"
          style={customStyles}
        >
          <div className={'center'}>
            <div style={{display: 'flex'}}>
              <div className={'input-group'}>
                <label>First name</label> <input name={'firstName'} onChange={this.handleChange} autoFocus={true}/>
              </div>
              <div className={'input-group'}>
                <label>Last name</label> <input name={'lastName'} onChange={this.handleChange}/>
              </div>
            </div>
            <div className={'input-group'}>
              <label>Email</label> <input />
            </div>
            <div style={{display: 'flex'}}>
              <div className={'input-group'}>
                <label>Check-in</label> <DayPickerInput onDayChange={day => console.log(day)} />
              </div>
              <div className={'input-group'}>
                <label>check-out</label> <DayPickerInput onDayChange={day => console.log(day)} />
              </div>
            </div>
            <div className={'input-group'}>
              <button onClick={this.props.closeModal} className={'btn__new dangerous'}>Cancel</button>
              <button onClick={this.createNewLessee} className={'btn__new'}>Create</button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

NewLesseeModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired
}

export default NewLesseeModal