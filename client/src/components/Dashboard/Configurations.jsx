import React from 'react'

import { NotificationManager } from 'react-notifications'

import * as backend from '../../backend'
import ConfirmButton from '../Buttons/confirm.jsx';
import GoBack from '../Misc/GoBack.jsx'

const BOOKING_TYPE = 'bookingTypes'
const TDY_TYPE = 'purposeTypes'
const GUEST_TYPE = 'guests'
const RANK_TYPES = 'ranks'

const spaceBottom = {
  paddingTop: '1em',
}

const newBtn = {
  padding: '0',
  minWidth: '0',
  margin: '5px 0'
}

const editInputStyle = {
  borderBottom: '1pt black solid',
  backgroundColor: '#bdbdbd30',
  borderRadius: '3px 3px 0 0',
  fontSize: '12pt',
  textIndent: '5px',
  textTransform: 'uppercase'
}

const gridDisplay = {
  display: 'grid',
  gridTemplateColumns: '[pad1] 5% [left] 45% [right] 45% [pad2] 5%',
  gridTemplateRows: 'auto',
  justifyItems: 'center',
  gridRowGap: '10px'
}

const iconStyle = {
  // fontSize: '1.5em',
  // cursor: 'pointer',
  // marginRight: '10px'
}

const textStyle = {
  width: '200px',
  fontSize: '12pt'
}

class ExitableRow extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isEditing: this.props.isEditing || false,
      name: this.props.name
    } 
  }

  handleChange = (event) => {
    let { target } = event
    this.setState({ [target.name]: target.value })
  }

  toggleEdit = () => {
    this.setState({ isEditing: !this.state.isEditing })
  }

  doDelete = async (callback) => {
    if (confirm('Are you sure you want to delete this item?')) {
      let res = await callback()
      if (res.statusText !== 'OK') {
        NotificationManager.error('Unable to delete item')
        return
      }
      this.props.removeFromState(this.props.configName, this.props.id)
      NotificationManager.info('Delete item!')
    }
  }

  delete = () => {
    switch (this.props.configName) {
    case BOOKING_TYPE:
      this.doDelete(() => backend.deleteBookingTypes(this.props.id))
      break
    case TDY_TYPE:
      this.doDelete(() => backend.deleteTdyType(this.props.id))
      break
    case GUEST_TYPE:
      this.doDelete(() => backend.deleteGuestType(this.props.id))
      break
    case RANK_TYPES:
      this.doDelete(() => backend.deleteRank(this.props.id))
      break
    }
  }

  save = () => {
    this.toggleEdit()
  }

  render() {
    return(
      <React.Fragment>
        {!this.state.isEditing && 
        <tr>
          <td style={{...spaceBottom, ...textStyle} }>{this.props.name}</td>
          <td style={spaceBottom}>
            <button onClick={this.toggleEdit} style={{marginRight: '5px'}} disabled><i class="fas fa-edit" style={iconStyle}></i></button>
            <button onClick={this.delete}><i class="fas fa-trash"></i></button>
          </td>
        </tr>}
        {this.state.isEditing &&
        <tr>
          <td style={spaceBottom}><input type="text" name={'name'} value={this.state.name} onChange={this.handleChange} style={editInputStyle}/></td>
          <td style={spaceBottom}>
            <button onClick={this.save} style={{marginRight: '5px'}}><i class="fas fa-save" style={iconStyle}></i></button>
            <button onClick={this.toggleEdit}><i class="fas fa-window-close"></i></button>
          </td>
        </tr>}
      </React.Fragment>
    )
  }
}

class Configurations extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      ranks: [],
      purposeTypes: [],
      rooms: [],
      guests: [],
      bookingTypes: [],
      houses: [],
    }
  }
  
  componentWillMount(){
    Promise.all([
      backend.getAllBookingTypesAsync(), 
      backend.getRoomsAsync(), 
      backend.getHousesAsync(),
      backend.getGuestTypesAsync(),
      backend.getTdyTypesAsync(),
      backend.getAllRanksAsync()
    ]).then(res => {
      this.setState({
        bookingTypes: res[0].data,
        rooms: res[1].data,
        houses: res[2].data,
        guests: res[3].data,
        purposeTypes: res[4].data,
        ranks: res[5].data
      })
    })
  }

  addNewTdy = async (newName) => {
    const res = await backend.addTdyType(newName)
    if (res.statusText === 'OK') {
      let { data } = res

      NotificationManager.info(`Added ${newName} to ${TDY_TYPE}`)
      this.setState({
        purposeTypes: [...this.state.purposeTypes, {id: data.id, name: newName}]
      })
      return
    }
  }

  addGuestType = async (newName) => {
    const res = await backend.addNewGuestType(newName)
    if (res.statusText === 'OK') {
      let { data } = res

      NotificationManager.info(`Added ${newName} to ${GUEST_TYPE}`)
      this.setState({
        guests: [...this.state.guests, {id: data.id, name: newName}]
      })
      return
    }
  }

  addBookingType = async (newName) => {
    const res = await backend.addBookingType(newName)
    if (res.statusText === 'OK') {
      let { data } = res

      NotificationManager.info(`Added ${newName} to ${BOOKING_TYPE}`)
      this.setState({
        bookingTypes: [...this.state.bookingTypes, {id: data.id, name: newName}]
      })
      return
    }
  }

  addRankType = async (newName) => {
    const res = await backend.addNewRank(newName)
    if (res.statusText === 'OK') {
      let { data } = res
      NotificationManager.info(`Added ${newName} to ${RANK_TYPES}`)
      this.setState({
        ranks: [...this.state.ranks, {id: data.id, name: newName}]
      })
      return
    }
  }

  addNew = async (configName) => {
    let newName = prompt(`Add new ${configName}`)
    if (newName === "" || newName === null || newName === undefined) {
      NotificationManager.error('Did not add new config')
      return
    }

    switch(configName) {
    case TDY_TYPE:
      this.addNewTdy(newName)
      break
    case GUEST_TYPE:
      this.addGuestType(newName)
      break
    case BOOKING_TYPE:
      this.addBookingType(newName)
      break
    case RANK_TYPES:
      this.addRankType(newName)
      break
    default:
      NotificationManager.error(`Unable to add ${newName} to ${configName}` )
      break
    }
  }

  removeFromState = (configName, id) => {
    let config = this.state[configName]
    let index = config.findIndex(e => e.id === id)
    config.splice(index, 1)
    this.setState({
      [configName]: config
    })
  }

  render() {
    return(
      <div style={{margin: '0 5%'}}>
        <GoBack onClick={this.props.toggle} />
        <div style={gridDisplay}>
        <section style={{gridArea: 'left', gridRowStart: 1, gridRowEnd: 1}}>
          <table>
            <thead>
              <th colSpan={1}>houses</th>
              <th colSpan={1}><button className={'btn__new'} style={{...newBtn, opacity: '0.5'}} disabled>+</button></th>
            </thead>
            <tbody>
              {this.state.houses.map(house => {
                return <ExitableRow id={house.id} name={house.name} />
              })}
            </tbody>
          </table>
        </section>
        {/* ROOMS */}
        <section style={{gridArea: 'left', gridRowStart: 2, gridRowEnd: 6}}>
          <table>
            <thead>
              <th colSpan={1}>Rooms</th>
              <th colSpan={1}><button className={'btn__new'} style={{...newBtn, opacity: '0.5'}} disabled>+</button></th>
            </thead>
            <tbody>
              {this.state.rooms.map(room => {
                return <ExitableRow name={room.name} />
              })}
            </tbody>
          </table>
        </section>
        {/* RANKS */}
        <section style={{gridArea: 'right', gridRowStart: 1, gridRowEnd: 1}}>
          <table>
            <thead>
              <th colSpan={1}>Guest types</th>
              <th colSpan={1}><button className={'btn__new'} style={newBtn} onClick={() => this.addNew(GUEST_TYPE) }>+</button></th>
            </thead>
            <tbody>
              {this.state.guests.map(room => {
                return <ExitableRow id={room.id} name={room.name} configName={GUEST_TYPE  } removeFromState={this.removeFromState}/>
              })}
              {/* <tr colSpan={2}><button className={'btn__new minimized'}>+  Add</button></tr> */}
            </tbody>
          </table>
        </section>
        {/* TDY TYPES */}
        <section style={{gridArea: 'right', gridRowStart: 2, gridRowEnd: 2}}>
          <table>
            <thead>
              <th colSpan={1}>Program Types</th>
              <th colSpan={1}><button className={'btn__new'} style={newBtn} onClick={() => this.addNew(TDY_TYPE) }>+</button></th>
            </thead>
            <tbody>
              {this.state.purposeTypes.map(room => {
                return <ExitableRow id={room.id}  name={room.name} configName={TDY_TYPE} removeFromState={this.removeFromState}/>
              })}
            </tbody>
          </table>
        </section>
        <section style={{gridArea: 'right', gridRowStart: 3, gridRowEnd: 3}}>
          <table>
            <thead>
              <th colSpan={1}>Ranks</th>
              <th colSpan={1}><button className={'btn__new'} style={newBtn } onClick={() => this.addNew(RANK_TYPES) }>+</button></th>
            </thead>
            <tbody>
              {this.state.ranks.map(room => {
                return <ExitableRow id={room.id}  name={room.name} configName={RANK_TYPES} removeFromState={this.removeFromState}/>
              })}
            </tbody>
          </table>
        </section>
        <section style={{gridArea: 'right', gridRowStart: 4, gridRowEnd: 4}}>
          <table>
            <thead>
              <th colSpan={1}>Booking Types</th>
              <th colSpan={1}><button className={'btn__new'} style={newBtn} onClick={() => this.addNew(BOOKING_TYPE) }>+</button></th>
            </thead>
            <tbody>
              {this.state.bookingTypes.map(btype => {
                return <ExitableRow id={btype.id}  name={btype.name} configName={BOOKING_TYPE} removeFromState={this.removeFromState}/>
              })}
            </tbody>
          </table>
        </section>
        </div>
        <span style={{display: 'flex', justifyContent: 'flex-end', padding: '25px'}}>
          <ConfirmButton confirmAction={this.props.toggle} removeMessage={'Cancel'} />
        </span>
      </div>
    )
  }
}

export default Configurations