import React, { ChangeEvent } from 'react'
import { inject, observer } from 'mobx-react';

import { NotificationManager } from 'react-notifications';

import { EmailTemplate, EmailData } from '../../interfaces'
import { backend } from '../../backendts'
import { buildGmailLink, buildMailToLink } from '../../utils'

import { UserStore } from '../../stores/userStore'
import ConfirmButton from '../Buttons/confirm';
import CoolLoader from '../Misc/CoolLoader'

const textAreaStyle = {
  width: '100%',
  height: '40vh',
  padding: '5px',
  fontSize: '13pt'
}

interface EmailProps {
  userStore: UserStore
}

interface EmailState {
  templates: Array<EmailTemplate>
  emails: Array<string>
  originalEmails: Array<string>
  toEmail: string
  fromEmail: string
  emailText: string
  subject: string
  showEmails: Boolean
  loading: Boolean
}

@inject('userStore')
@observer
class Emails extends React.Component<EmailProps, EmailState> {

  node: any = null;
  state = {
    templates: new Array<EmailTemplate>(),
    emails: new Array<string>(),
    originalEmails: new Array<string>(),
    toEmail: '',
    fromEmail: this.props.userStore.email,
    emailText: '',
    subject: '',
    showEmails: false,
    loading: false
  }

  componentWillMount() {
    document.addEventListener('mousedown', this.handleClick, false)
    
    let to = this.extractToEmailFromURL(window.location.href)
    if (to) { this.setState({ toEmail: to.replace('#/', '') }) }
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClick, false)
	}

  componentDidMount() {
    backend.emails.getAllEmailTemplate()
      .then(templates => this.setState({ templates }) )
      .catch(err => console.log(err))

    backend.emails.getAllLesseesEmails()
      .then(emails => this.setState({ emails, originalEmails: emails }))
      .catch(err => console.log(err))
  }

  extractToEmailFromURL = (url: string): string => {
    const re = /to=(?<to>.*)/im
    
    let matches = url.match(re)
    if (matches) {
      let { to } = matches.groups
      return to || ''
    }

    return ''
  }

  validateToEmail = (toEmail: string): Boolean => {
    return toEmail.length > 0
  }

  toggleShowEmails = () => {
    this.setState({ showEmails: !this.state.showEmails })
  }

  openGmailLink = () => {
    let { toEmail, subject, emailText } = this.state
    let gmailLink = buildGmailLink(toEmail, subject, emailText)
    window.open(gmailLink, '_blank')
  }

  openApplicationLink = () => {
    let { toEmail, subject, emailText } = this.state
    let mailLink = buildMailToLink(toEmail, subject, emailText)
    window.open(mailLink, '_blank')        
  }

  filterEmails = (filter: string): Array<string> => {
    let filteredEmails = this.state.originalEmails.filter(email => email.startsWith(filter))
    return filteredEmails
  }
  
  resolveTemplate = async (templateName: string, toEmail: string): Promise<string> => {
    if (!this.validateToEmail(this.state.toEmail)) {
      NotificationManager.error('To email cannot be blank')
      return
    }

    let resolvedTemplate = await backend.emails.resolveEmailTemplate(templateName, toEmail)
      .catch(err => { throw new Error(err) })
    return resolvedTemplate.template
  }

  sendEmail = async () => {
    this.setState({ loading: true })
    const emailData : EmailData = {
      from_email: this.state.fromEmail,
      email: this.state.toEmail,
      subject: this.state.subject,
      email_text: this.state.emailText,
    }
    
    backend.emails.sendEmail(emailData)
      .then(res => {
        if (res.statusText !== 'ACCEPTED' && res.statusText !== 'OK') { throw new Error('Bad request') }

        NotificationManager.info(`Sent email to ${this.state.toEmail}`)
        this.setState({ loading: false, toEmail: '', subject: '', emailText: '' })
      })
      .catch(err => {
        console.log(err)

        this.setState({ loading: false })
        NotificationManager.error('Unable to send email, please try again')
      })
  }

  putToEmailInState = (toEmail: string) => {
    this.setState({ toEmail })
  }

  clearForm = () => {
    this.setState({
      toEmail: '',
      subject: '',
      emailText: ''
    })
  }

  handleClick = (e) => {
		if (this.node.contains(e.target)) {
			if (!this.state.showEmails) {
        this.setState({ showEmails: true })
        return
      }
		} else {
      this.setState({ showEmails: false })
    }

	}

  handleChange = (event: ChangeEvent<any>) => {
    let { target } = event

    this.setState({
      ...this.state,
      [target.name]: target.value
    })
  }

  handleToEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    let { target } = event
    let filteredEmails = this.filterEmails(target.value)

    this.setState({
      toEmail: target.value,
      emails: filteredEmails
    })
  }

  handleSelectChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    let { target } = event
    let resovledTemplate = await this.resolveTemplate(target.value, this.state.toEmail)
      .catch(err => { console.log(err); NotificationManager.error('Unable to resolve template'); return })

    this.setState({
      emailText: resovledTemplate || ''
    })
  }

  render(){
    let { templates } = this.state
    return (
      <div>
        {/* HEADER SECTION */}
        {!this.state.loading ? 
        <section>
          <div>
            <div className="input-group full" ref={node => this.node = node}>
              <label htmlFor='toEmail'>To</label>
              <input type='text' name={'toEmail'} onChange={this.handleToEmailChange} value={this.state.toEmail} autoComplete={'false'}/>
              {this.state.showEmails &&             
                <div className="dropdown__email">
                  <ul>
                    {this.state.emails.map(email => {
                      return <button onClick={() => { this.putToEmailInState(email); this.toggleShowEmails() }}>{email}</button>
                    })}
                  </ul>
                </div>
              }
            </div>
            <div className="input-group full">
              <label htmlFor='fromEmail'>From</label>
              <input type='text' name={'fromEmail'} onChange={this.handleChange} value={this.state.fromEmail} />
            </div>
            <div className="input-group full">
              <label htmlFor='subject'>Subject</label>
              <input type='text' name={'subject'} onChange={this.handleChange} value={this.state.subject} />
            </div>
            <div className="input-group full">
              <label>Template</label>
              <select onChange={this.handleSelectChange}>
                <option value={null}>-- NONE --</option>
                {templates.map(template => {
                  return <option value={template.name}>{template.name}</option>
                })}
              </select>
            </div>
          </div>
          <div>
            <textarea style={{...textAreaStyle, resize: 'none', borderRadius: '3px', overflow: 'auto'}} name={'emailText'} value={this.state.emailText} onChange={this.handleChange} />
          </div>
          <span className={'email__links'}>
            <span>
              <a onClick={this.openApplicationLink}>Open in mail</a>
              <a onClick={this.openGmailLink}>Open in gmail</a>
            </span>
            <span style={{display: 'flex'}}>
              <ConfirmButton  removeMessage={'Clear'} confirmAction={this.clearForm} />
              <ConfirmButton style={{marginLeft: '10px', backgroundColor: '#2D9CDB'}}  removeMessage={'Send'} confirmAction={this.sendEmail} />
            </span>
          </span>
        </section> :
        <React.Fragment>
          <h2 style={{ color: 'grey', textAlign: 'center' }}>Sending email...</h2>
          <CoolLoader style={{ height: '80%' }}/>
        </React.Fragment>}
      </div>
    )
  }
}

export default Emails