import React from "react"

import { NotificationManager } from "react-notifications"

import ConfirmButton from '../Buttons/confirm.jsx'
import * as backend from '../../backend'

const testData = [
  { name: "DISCUSSION", template: "THIS SHOULD BE A REALLY LOG template!!!!" },
  { name: "SIGNED", template: "THIS SHOULD BE A REALLY LOG TEXT!!!! OF ANOTHER THINFDSJDFLA" }
]

const listStyle = {
  listStyleType: 'none'
}

const listItemStyle = {
  padding: '10px',
  cursor: 'pointer'
}

const selected = {
  ...listItemStyle,
  backgroundColor: '#55c4b7',
  fontWeight: 'bold',
  borderRadius: '3px'
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
  gridArea: 'left'
}

const textAreaStyle = {
  width: '100%',
  height: '40vh',
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
  margin: '25px 5% 0 25%'
}

class EditEmailTemplates extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedId: 0,
      selectedKey: '',
      templateText: '',
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
    console.log('==============>', elem, data, selectedKey)
    
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

  handleChange = (event) => {
    let { target } = event
    this.setState({ [target.name]: target.value })
  }

  render() {
    return (
      <div>
        <div style={gridDisplay}>
          <div style={gridLeft}>
            <ul style={listStyle}>
              {this.state.data.map(elem => {
                let { name } = elem
                return (
                  <li
                    style={this.state.selectedKey === name ? selected : listItemStyle} 
                    onClick={() => this.handleClick(name)}
                  >
                    { name }
                  </li>
                )
              })}
              <li>
                <button className={'btn__new minimized'} style={{width: 'calc(100% - 10px)'}} onClick={this.addNew}>
                  +  New
                </button>
              </li>
            </ul>
          </div>
          <div style={gridRight}>
            <textarea name={'templateText'} value={this.state.templateText} style={textAreaStyle} onChange={this.handleChange} />
          </div>
        </div>
        <div style={btnDivStyle}>
          <ConfirmButton removeMessage={'Cancel'} confirmAction={this.props.toggle}  style={{marginRight: '5px'}}/>
          <span style={{display: 'flex'}}>
          {/* <ConfirmButton removeMessage={'Delete'} confirmAction={this.deleteTemplate} /> */}
            <ConfirmButton removeMessage={this.state.btnText} style={{backgroundColor: this.state.btnColor}} confirmAction={this.saveNewEmailTemplate} />
          </span>
        </div>
      </div>
    )
  }
}

export default EditEmailTemplates;
