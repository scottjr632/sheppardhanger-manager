import React from 'react'
import Modal from 'react-modal'
import PropTypes from 'prop-types'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { NotificationManager } from 'react-notifications'

import * as backend from '../../backend'
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
    zIndex: 99
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
      fname: '',
      lname: '',
      email: '',
      rank: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipcode: '',
      notes: '',
      pet: false,
      numberofguests: 0,
      purpose: '',
      createBooking: false,
      rooms: [],
      activeRoomId: undefined
    }
  }

  componentDidMount() {
    backend.getRooms(res => {
      let { data } = res
      if (data) {
        this.setState({ rooms: data})
      }
    })
  }

  createNewLessee = async () => {
    let { checkInDate, checkOutDate, createBooking } = this.state
    let {
      fname, lname, email, rank, phone, address, city, state, zipcode, notes
    } = this.state
    let lesseeData = {
      fname, lname, email, rank, phone, address, city, state, zipcode, notes
    }
    let lessee
    try {
      lessee = await backend.createNewLesseeAsync(lesseeData)
    } catch (error) {
      NotificationManager.error(`User already exists with email ${this.state.email}`) 
      return   
    }
    console.log(lessee)
    if (createBooking) {
      let resData = {
        lesseeid: lessee.id,
        checkindate: checkInDate,
        checkoutdate: checkOutDate,
        bookingtypeid: 1,
        roomid: this.state.activeRoomId,
        pet: this.state.pet,
        purpose: this.state.purpose,
        numberofguests: this.state.numberofguests
      }
      backend.createNewReservation(resData, (res)=>{
        if (res.status !== 200) {
          NotificationManager.error(`Unable to create reservation for ${this.state.lname}, ${this.state.fname}`)
          return
        }
      })
      NotificationManager.info(`Created reservation for ${this.state.lname}, ${this.state.fname}`)
    }
    NotificationManager.info(`Create new lessee: ${this.state.lname}, ${this.state.fname} `)
    this.props.closeModal()
  }

  handleChange = (event) => {
    let { target } = event
    let value = target.type === 'checkbox' ? target.checked : target.value
    this.setState({
      [target.name]: value
    }, () => console.log(this.state))
  }

  setDate = (name, value) => {
    this.setState( {[name]: value} )
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
                <label>First name</label> <input name={'fname'} onChange={this.handleChange} autoFocus={true}/>
              </div>
              <div className={'input-group'}>
                <label>Last name</label> <input name={'lname'} onChange={this.handleChange}/>
              </div>
            </div>
            <div style={{display: 'flex'}}>
              <div className={'input-group'}>
                <label>Email</label> <input name={'email'} onChange={this.handleChange}/>
              </div>
              <div className={'input-group'}>
                <label>Phone number</label> <input name={'phone'} onChange={this.handleChange} autoFocus={true}/>
              </div>
            </div>
            <div className={'input-group'}>
              <label>Rank</label> <input name={'rank'} onChange={this.handleChange}/>
            </div>
            <div style={{display: 'flex'}}>
              <div className={'input-group'}>
                <label>Address</label> <input name={'address'} onChange={this.handleChange}/>
              </div>
              <div className={'input-group'}>
                <label>City</label> <input name={'city'} onChange={this.handleChange}/>
              </div>
            </div>
            <div style={{display: 'flex'}}>
              <div className={'input-group'}>
                <label>State</label> <input name={'state'} onChange={this.handleChange}/>
              </div>
              <div className={'input-group'}>
                <label>Zipcode</label> <input name={'zipcode'} onChange={this.handleChange}/>
              </div>
            </div>
            <div className={'input-group'}>
              <label>Notes</label> 
              {/* <textarea name={'notes'} onChange={this.handleChange} /> */}
              <input name={'notes'} onChange={this.handleChange}/>
            </div>
            <div className={'input-group'}>
                <label>Create booking </label> <br />
                <input name={'createBooking'} type={'checkbox'} onChange={this.handleChange} checked={this.state.createBooking}/>
            </div>
            { this.state.createBooking &&
            <section>
              <div style={{display: 'flex'}}>
                <div className={'input-group'}>
                  <label>Check-in</label> <DayPickerInput onDayChange={day => this.setDate('checkInDate', day)} />
                </div>
                <div className={'input-group'}>
                  <label>check-out</label> <DayPickerInput onDayChange={day => this.setDate('checkOutDate', day)} />
                </div>
              </div>
              <div style={{display: 'flex'}}>
                <div className={'input-group'}>
                  <label>Number of guests</label> <input type="text" name="numberofguests" value={this.state.numberofguests} onChange={this.handleChange}/>
                </div>
                <div className={'input-group'}>
                  <label>Purpose</label> <input type="text" name="purpose" onChange={this.handleChange}/>
                </div>
              </div>
              <div style={{display: 'flex'}}>
                <div className={'input-group'}>
                  <label>Room</label><br />
                  <select name={'activeRoomId'} onChange={this.handleChange}>
                    {this.state.rooms.map(room => {
                      return <option value={room.id}>{room.name}</option>
                    })}
                  </select>
                </div>
                <div className={'input-group'}>
                  <label>Are they bringing a pet? </label> <br />
                  <input name={'pet'} type={'checkbox'} onChange={this.handleChange} />
                </div>
              </div>
            </section>
            }
            <div className={'input-group'} style={{display: 'flex'}}>
              <button onClick={this.props.closeModal} className={'pull-left btn__new dangerous'}>Cancel</button>
              <button onClick={this.createNewLessee} className={'pull-right btn__new'}>Create</button>
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