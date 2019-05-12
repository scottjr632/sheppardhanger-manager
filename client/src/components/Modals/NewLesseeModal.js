import React from 'react'
import Modal from 'react-modal'
import PropTypes from 'prop-types'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { NotificationManager } from 'react-notifications'
import { inject, observer } from 'mobx-react'

import ConfirmButton from '../Buttons/confirm.jsx'
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

@inject ('reservationStore')
@inject ('scheduleStore')
@inject ('lesseeStore')
@observer
class NewLesseeModal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      tdys: [],
      ranks: [],
      guests: [],
      checkInDate: undefined,
      checkOutDate: undefined,
      isCheckInEmpty: true,
      isCheckOutEmpty: true,
      fname: '',
      lname: '',
      email: '',
      rank: 1,
      phone: '',
      address: '',
      city: '',
      state: '',
      zipcode: '',
      notes: '',
      pet: false,
      numberofguests: 1,
      purpose: 1,
      createBooking: false,
      rooms: [],
      activeRoomId: 1
    }
  }

  componentDidMount() {
    backend.getRooms(res => {
      let { data } = res
      if (data) {
        this.setState({ rooms: data })
      }
    })

    backend.getAllTDYTypes(res => {
      let { data } = res
      if(data) { this.setState({tdys: data})}
    })

    backend.getAllGuestTypes(res => {
      let { data } = res
      if(data) { this.setState({guests: data})}
    })

    backend.getAllRanks(res => {
      let { data } = res
      if(data) { this.setState({ranks: data})}
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
      this.props.lesseeStore.addNewLessee(lessee)
    } catch (error) {
      console.log(error)
      NotificationManager.error(`User already exists with email ${this.state.email}`) 
      return   
    }
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
      backend.createNewReservation(resData, (res) => {
        if (res.status !== 200) {
          NotificationManager.error(`Unable to create reservation for ${this.state.lname}, ${this.state.fname}`)
          return
        }
        let { data } = res
        if (data){
          let res = this.props.reservationStore.addReservationFromResObject(data)
          this.props.scheduleStore.addEvent(res)
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
    this.setState({ [target.name]: value })
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
              <label style={{width: '100%'}}>Rank</label>
              <select onChange={this.handleChange} name={'rank'} style={{width: '70%'}}>
                {this.state.ranks.map(rank => {
                    return <option key={rank.id} value={rank.id}>{rank.name}</option>
                  })
                }
              </select>
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
                  <label style={{width: '100%'}}>Purpose</label> 
                  <select onChange={this.handleChange} name={'purpose'} style={{width: '70%'}}>
                  {
                    this.state.tdys.map(tdy => {
                      return <option key={tdy.id} value={tdy.id}>{tdy.name}</option>
                    })
                  }
                  </select>
                </div>
                <div className={'input-group'}>
                  <label style={{width: '100%'}}>Any guests? </label> <br />
                  <select onChange={this.handleChange} name={'numberofguests'} style={{width: '70%'}}>
                    {this.state.guests.map(guest => {
                      return <option key={guest.id} value={guest.id}>{guest.name}</option>
                    })}
                  </select>
                </div>
              </div>
              <div style={{display: 'flex'}}>
                <div className={'input-group'}>
                  <label>Room</label><br />
                  <select name={'activeRoomId'} onChange={this.handleChange} value={this.state.activeRoomId}>
                    {this.state.rooms.map(room => {
                      return <option key={room.id} value={room.id}>{room.name}</option>
                    })}
                  </select>
                </div>
              </div>
            </section>
            }
          </div>
          <div className={'input-group'} style={{width: '100%', display: 'flex', justifyContent: 'space-evenly', marginTop: '20px'}}>
            <ConfirmButton removeMessage={'Cancel'} confirmAction={this.props.closeModal}/>
            <ConfirmButton removeMessage={'Create'} confirmAction={this.createNewLessee} style={{backgroundColor: '#128de9'}} />
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