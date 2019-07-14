import React, { ChangeEvent } from 'react'

import { EmailTemplate } from '../../interfaces'
import { backend } from '../../backendts'

const textAreaStyle = {
  width: '100%',
  height: '40vh',
  padding: '5px',
  fontSize: '13pt'
}

interface EmailProps {}
interface EmailState {
  templates: Array<EmailTemplate>
  toEmail: string,
  fromEmail: string,
  emailText: string,
  subject: string
}

class Emails extends React.Component<EmailProps, EmailState> {

  state = {
    templates: new Array<EmailTemplate>(),
    toEmail: '',
    fromEmail: '',
    emailText: '',
    subject: '',
  }

  componentDidMount() {
    backend.emails.getAllEmailTemplate()
      .then(templates => this.setState({ templates }) )
      .catch(err => console.log(err))
  }

  handleChange = (event: ChangeEvent<any>) => {
    let { target } = event

    this.setState({
      ...this.state,
      [target.name]: target.value
    })
  }

  handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    let { target } = event
    let emailTemplate = this.state.templates.find(template => template.name === target.value)

    this.setState({
      emailText: emailTemplate ? emailTemplate.template : ''
    })

  }

  render(){
    let { templates } = this.state
    return (
      <div>
        {/* HEADER SECTION */}
        <div>
          <div className="input-group full">
            <label htmlFor='toEmail'>To</label>
            <input type='text' name={'toEmail'} onChange={this.handleChange}/>
          </div>
          <div className="input-group full">
            <label htmlFor='fromEmail'>From</label>
            <input type='text' name={'fromEmail'} onChange={this.handleChange}/>
          </div>
          <div className="input-group full">
            <label htmlFor='subject'>Subject</label>
            <input type='text' name={'subject'} onChange={this.handleChange}/>
          </div>
          <div className="input-group full">
            <label>Template</label>
            <select onChange={this.handleSelectChange}>
              <option value={0}>-- NONE --</option>
              {templates.map(template => {
                return <option value={template.name}>{template.name}</option>
              })}
            </select>
          </div>
        </div>
        <div>
          <textarea style={{...textAreaStyle, resize: 'none', borderRadius: '3px', overflow: 'auto'}} name={'emailText'} value={this.state.emailText} onChange={this.handleChange} />
        </div>
      </div>
    )
  }
}

export default Emails