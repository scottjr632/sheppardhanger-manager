import React from 'react'
import Modal from 'react-modal'
import { NotificationManager } from 'react-notifications'

import ConfirmButton from '../Buttons/confirm.jsx'
import CoolLoader from '../Misc/CoolLoader.jsx'
import * as backend from '../../backend'

Modal.setAppElement('#root')

const customStyles = {
  content : {},
  overlay : {
    zIndex: 99
  }
};

const div1Style = {
  padding: '10px 20%',
  display: 'flex',
  flexDirection: 'column'
}

const div2Style = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
}

const inputStyle = {
  border: '1pt black solid',
  borderRadius: '3px',
  padding: '2px 5px',
  float: 'none',
  width: '20vw'
}

const attachStyle = {
  backgroundColor: '#27ae60ad',
  color: 'white',
  margin: '10px',
  padding: '5px 20px',
  borderRadius: '30px',
  cursor: 'pointer',
  fontSize: '9pt'
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

const btnStyle = {
  backgroundColor: '#2D9CDB'
}

class NewEmailModal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      email: this.props.email || '',
      subject: this.props.subject || '',
      email_text: this.props.email_text || '',
      attachements: this.props.attachements || [],
      loading: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.state) {
      this.setState({...nextProps})
    }
  }

  handleChange = (event) => {
    let { target } = event
    this.setState({
      [target.name]: target.value
    })
  }

  exit = () => {
    this.setState({ 
      email: '',
      subject: '',
      email_text: '',
      attachements: [],
      loading: false
     }, this.props.toggleModal)
  }

  sendEmail = async () => {
    this.setState({ loading: true })
    
    const res = await backend.sendEmail(this.state)

    if (res.statusText !== 'ACCEPTED' && res.statusText !== 'OK') {
      this.setState({ loading: false })
      NotificationManager.error('Unable to send email, please try again')
      return
    }
    NotificationManager.info(`Sent email to ${this.state.email}`)
    this.exit()
  }

  render(){
    return (
      <Modal
        isOpen={this.props.showModal}
        contentLabel="New Lessee"
        style={customStyles}
      >
        {!this.state.loading && 
        <div style={div1Style}>
          <div style={div2Style}>
            <div className={'input-group'}>
              <label htmlFor={'email'}>To Email</label>
              <input type={'text'} name={'email'} style={inputStyle} value={this.state.email} onChange={this.handleChange} />
            </div>
            <div className={'input-group'}>
              <label htmlFor={'subject'}>Subject</label>
              <input type={'text'} name={'subject'} style={inputStyle} value={this.state.subject} onChange={this.handleChange} />
            </div>
          </div>
          <div>
            <textarea style={textAreaStyle} name={'email_text'} value={this.state.email_text} onChange={this.handleChange} />
          </div>
          <div style={div2Style} style={{marginTop: '20px'}}>
            {this.state.attachements.map(attach => {
              return <div style={attachStyle}><i class="fas fa-paperclip" style={{margin: '0 5px 0 0'}}></i>{attach.name}</div>
            })}
            <span style={div2Style}>
              <ConfirmButton  removeMessage={'Cancel'} confirmAction={this.exit} />
              <ConfirmButton style={{marginLeft: '10px',...btnStyle}}  removeMessage={'Send'} confirmAction={this.sendEmail} />
            </span>
          </div>
        </div>}
        {this.state.loading && 
        <React.Fragment>
          <h2 style={{ color: 'grey', textAlign: 'center' }}>Sending email...</h2>
          <CoolLoader style={{ height: '80%' }}/>
        </React.Fragment>}
      </Modal>
    )
  }

}

export default NewEmailModal;