import React from 'react'

import * as backend from '../../backend'
import ConfirmButton from '../Buttons/confirm.jsx';
import GoBack from '../Misc/GoBack.jsx'

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

  delete = () => {}

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
            <button onClick={this.toggleEdit} style={{marginRight: '5px'}}><i class="fas fa-edit" style={iconStyle}></i></button>
            <button onClick={this.delete} disabled={true}><i class="fas fa-trash"></i></button>
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

  addNew = () => {

  }

  render() {
    return(
      <div style={{margin: '0 5%'}}>
        <GoBack onClick={this.props.toggle} />
        <div style={gridDisplay}>
        <section>
          <table>
            <thead>
              <th colSpan={1}>Email</th>
              <th colSpan={1}><button className={'btn__new'} style={newBtn}>+</button></th>
            </thead>
            <tbody>
              <ExitableRow name={'scottjr632@gmail.com'} />
            </tbody>
          </table>
        </section>
        <section style={{gridArea: 'left', gridRowStart: 1, gridRowEnd: 1}}>
          <table>
            <thead>
              <th colSpan={1}>houses</th>
              <th colSpan={1}><button className={'btn__new'} style={newBtn}>+</button></th>
            </thead>
            <tbody>
              {this.state.houses.map(house => {
                return <ExitableRow name={house.name} />
              })}
            </tbody>
          </table>
        </section>
        {/* ROOMS */}
        <section style={{gridArea: 'left', gridRowStart: 2, gridRowEnd: 6}}>
          <table>
            <thead>
              <th colSpan={1}>Rooms</th>
              <th colSpan={1}><button className={'btn__new'} style={newBtn}>+</button></th>
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
              <th colSpan={1}><button className={'btn__new'} style={newBtn}>+</button></th>
            </thead>
            <tbody>
              {this.state.guests.map(room => {
                return <ExitableRow name={room.name} />
              })}
              {/* <tr colSpan={2}><button className={'btn__new minimized'}>+  Add</button></tr> */}
            </tbody>
          </table>
        </section>
        {/* TDY TYPES */}
        <section style={{gridArea: 'right', gridRowStart: 2, gridRowEnd: 2}}>
          <table>
            <thead>
              <th colSpan={1}>TDY Types</th>
              <th colSpan={1}><button className={'btn__new'} style={newBtn}>+</button></th>
            </thead>
            <tbody>
              {this.state.purposeTypes.map(room => {
                return <ExitableRow name={room.name} />
              })}
            </tbody>
          </table>
        </section>
        <section style={{gridArea: 'right', gridRowStart: 3, gridRowEnd: 3}}>
          <table>
            <thead>
              <th colSpan={1}>Ranks</th>
              <th colSpan={1}><button className={'btn__new'} style={newBtn}>+</button></th>
            </thead>
            <tbody>
              {this.state.ranks.map(room => {
                return <ExitableRow name={room.name} />
              })}
            </tbody>
          </table>
        </section>
        <section style={{gridArea: 'right', gridRowStart: 4, gridRowEnd: 4}}>
          <table>
            <thead>
              <th colSpan={1}>Booking Types</th>
              <th colSpan={1}><button className={'btn__new'} style={newBtn}>+</button></th>
            </thead>
            <tbody>
              {this.state.bookingTypes.map(btype => {
                return <ExitableRow name={btype.name} />
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