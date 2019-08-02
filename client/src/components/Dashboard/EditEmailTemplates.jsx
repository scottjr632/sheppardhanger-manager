import React from "react"
import PropTypes from 'prop-types'

import { NotificationManager } from "react-notifications"

import ConfirmButton from '../Buttons/confirm.jsx'
import GoBack from '../Misc/GoBack.jsx'
import * as backend from '../../backend'
import EditableListItem from '../editableListItem.jsx'

const testData = [
  { name: "DISCUSSION", template: "THIS SHOULD BE A REALLY LOG template!!!!" },
  { name: "SIGNED", template: "THIS SHOULD BE A REALLY LOG TEXT!!!! OF ANOTHER THINFDSJDFLA" }
]

const listStyle = {
  listStyleType: 'none'
}

const templateFillers = [
  { template: '**LESSEENAME**',  filler: "Lessee's first name", copy: () => {copy('**LESSEENAME**')} },
  { template: '**DATE**', filler: 'No filler yet', copy: () => copy('**DATE**') },
  { template: '**CURRENTMONTH**', filler: 'The current month', copy: () => copy('**CURRENTMONTH**') },
  { template: '**CURRENTDATE**', filler: 'The current date', copy: () => copy('**CURRENTDATE**') },
  { template: '**TOMORROWDATE**', filler: "Tomorrow's date", copy: () => copy('**TOMORROWDATE**') },
  { template: '**RESERVATIONCHECKINDATE**', filler: "The lessee's current or upcomming check in date", copy: () => copy('**RESERVATIONCHECKINDATE**') },
  { template: '**RESERVATIONCHECKOUTDATE**', filler: "The lessee's current or upcomming check out date", copy: () => copy('**RESERVATIONCHECKOUTDATE**') },
  { template: '**CODE**', filler: "Door code for lessee's current or upcomming reservation", copy: () => copy('**CODE**') },
  { template: '**HOUSE**', filler: "House name for lessee's current or upcomming reservation", copy: () => copy('**HOUSE**') },
  { template: '**ROOM**', filler: "Room name for lessee's current or upcomming reservation", copy: () => copy('**ROOM**') },
  { template: '**RESERVATIONMONTH**', filler: "Reservation month for lessee's current or upcomming reservation", copy: () => copy('**RESERVATIONMONTH**') },
  { template: '**LESSEEADDRESS**', filler: "Address for lessee", copy: () => copy('**LESSEEADDRESS**') },
]

const copy = (toBeCopied) => {
  const el = document.createElement('textarea')
  el.value = toBeCopied

  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  NotificationManager.info(`Copied ${toBeCopied} to clipboard!`)

}

const gridDisplay = {
  display: 'grid',
  gridTemplateColumns: '[pad1] 5% [left] 20% [right] 70% [pad2] 5%',
  gridTemplateRows: 'auto'
}

const gridRight = {
  gridArea: 'right'
}

const gridLeft = {
  gridArea: 'left',
}

const textAreaStyle = {
  width: '100%',
  height: '60vh',
  padding: '5px',
  resize: 'none',
  borderRadius: '3px',
  overflow: 'auto',
  overflowX: 'none',
  fontSize: '13pt'
}

const btnDivStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  // margin: '25px 5% 0 25%'
}

class EditEmailTemplates extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedId: 0,
      selectedKey: '',
      templateText: '',
      forceRefresh: false,
      data: testData,
      btnColor: '#128de9',
      btnText: 'Update'
    }

    backend.getEmailTemplates().then(res => {
      let { data } = res
      this.setState({ data })
    })
  }

  deleteTemplate = async () => {
    let { selectedKey } = this.state
    let { data } = this.state

    try {
      await backend.deleteEmailTemplate(selectedKey)
      let index = data.findIndex(elem => elem.name === selectedKey)  
      data.splice(index, 1)

      NotificationManager.info(`Deleted ${selectedKey}`)
      this.setState({ data })
    } catch (e) {
      NotificationManager.error(`Unable to delete ${selectedKey}`)
    }
  }

  addNew = () => {
    let name = prompt('Enter name of new email layout')
    if (name) {
      this.setState({ 
        data: this.state.data.concat( [{name , template: ''}] ),
        selectedKey: name,
        templateText: ''
       })
    }
  }
  
  saveNewEmailTemplate = async () => {
    let { selectedKey, templateText } = this.state
    let newTemplate = { name: selectedKey, template: templateText }

    let { data } = this.state
    let elem = data.find(elem => elem.name === selectedKey)
    
    if (elem) {
      elem.template = templateText
      this.setState({ data })
    }

    try {
      await backend.createNewEmailTemplate(newTemplate)
      NotificationManager.info('Updated email template')
    } catch (e) {
      NotificationManager.error('Unale to update email template')
    }
  }

  handleClick = (key) => {
    let res = this.state.data.find(elem => elem.name === key)
    let { template, id } = res
  
    this.setState({ templateText: template, selectedId: id, selectedKey: key })
  }

  updateName = async (key, newKey) => {
    try {
      const res = await backend.updateEmailTemplateName(key, newKey)

      let template = this.state.data.find(elem => elem.name === key)
      template.name = newKey

     this.setState({ selectedKey: newKey })
    } catch (error) {
      NotificationManager.error('Unable to update template name')
    }
  }

  handleChange = (event) => {
    let { target } = event
    this.setState({ [target.name]: target.value })
  }

  render() {
    return (
      <div>
        <GoBack onClick={this.props.toggle} />
        <div style={gridDisplay}>
          <div style={{...gridLeft, gridRowStart: 1, gridRowEnd: 4, maxHeight: '60vh', overflowY: 'scroll'}}>
            <ul style={listStyle}>
              {this.state.data.map(elem => {
                let { name } = elem
                return (
                  <EditableListItem 
                    name={name}
                    selectedKey={this.state.selectedKey} 
                    handleClick={this.handleClick}
                    updateName={this.updateName}
                  />
                )
              })}
              <li>
                <button className={'btn__new minimized'} style={{width: 'calc(100% - 10px)'}} onClick={this.addNew}>
                  +  New
                </button>
              </li>
            </ul>
          </div>
          <div style={{...gridRight, gridRowStart: 1, gridRowEnd: 1}}>
            <textarea name={'templateText'} value={this.state.templateText} style={textAreaStyle} onChange={this.handleChange} />
          </div>
          <div style={{...btnDivStyle, ...gridRight, gridRowStart: 2, gridRowEnd: 2}}>
            <ConfirmButton removeMessage={'Delete'} confirmAction={this.deleteTemplate} />
            <span style={{display: 'flex'}}>
              <ConfirmButton removeMessage={'Cancel'} confirmAction={this.props.toggle}  style={{marginRight: '5px'}}/>
              <ConfirmButton removeMessage={this.state.btnText} style={{backgroundColor: this.state.btnColor}} confirmAction={this.saveNewEmailTemplate} />
            </span>
          </div>
        </div>
        <div className="table-wrapper large-screen">
          <h4>Filler templates</h4>
          <table className="table-responsive card-list-table">
            <thead>
              <th>Filler</th>
              <th>To be resolved with</th>
            </thead>
            <tbody>
            {templateFillers.map(filler => {
              return (
                <tr>
                  <td>{filler.template}</td>
                  <td>{filler.filler}</td>
                  <td className={'.nobefore'}><button onClick={filler.copy}>Copy filler</button></td>
                </tr> 
              ) 
            })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default EditEmailTemplates;
