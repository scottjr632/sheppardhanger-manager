import React from 'react'

import { NotificationManager } from "react-notifications"

import Navi from '../components/HeaderComponents/Navbar'
import Emails from '../components/Dashboard/Emails.jsx'
import UserInfo from '../components/Dashboard/UserInfo.jsx'
import ReservationTable from '../components/Tables/Reservations'
import Question from '../components/Dashboard/Question.jsx'
import NewEmailModal from '../components/Modals/NewEmailModal.jsx'
import { buildGmailLink, buildMailToLink } from '../utils'
import { MONTHNAMES, EMAILPREFS } from '../constants'
import * as backend from '../backend'
import { inject, observer } from 'mobx-react';


const EMAILTYPES = {
  WELCOME: 'WELCOME',
  NOROOMS: 'NOROOMS',
  CONTRACT: 'CONTRACT'
}


const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '[left] 50% [right] 50%',
  gridTemplateRows: 'auto'
}

let formatEmails = (callback, ...emails) => {
  let formatted = []
  for (let email of emails) {
    
    let newEmail = {
      name: email.name,
      prettyName: email.name,
      right: <i class="fas fa-envelope"/>,
      btnText: <span style={{textTransform: 'lowercase'}}>{`SEND ${email.name} EMAIL`}</span>,
      btnAction: () => { callback(email.name, email.name) }
    }
    formatted.push(newEmail)
  }
  return formatted
}



@inject('userStore')
@observer
class Info extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      userId: 0,
      userInfo: {},
      showModal: false,
      emailSubject: '',
      email_text: '',
      originalEmails: [],
      emailTemplates: [],
    }
  }

  componentDidMount() {
    let { search } = this.props.location
    if (search && search.length > 1) {
      let id = search.match(/=(.*)/)
      if (id[1]) backend.getLesseeById(id[1], (res) => {
        let { data } = res
        if (data) this.setState({ userInfo: data, userId: id[1] })
      })
    }

    this.getAllEmailsTemplates()
  }

  getAllEmailsTemplates = async () => {
    const res = await backend.getAllEmailTemplates()
    let { data } = res
    if (data) {
      let formattedEmails = formatEmails(this.handleEmailFromUserPrefs, ...data)
      this.setState({ emailTemplates: formattedEmails, originalEmails: formattedEmails })
      return
    }

    NotificationManager.error('Unable to fetch email templates')
  }

  emailStuff = {
    generic: {prettyName: 'Send Email', right: <i class="fas fa-envelope"></i>, btnText: 'Create Email', btnAction: () => { this.goToEmailPage(this.state.userInfo.email) }},
  }

  emailInfo = {}
  
  documentsInfo = {
    masterContract: {prettyName: 'Master Contract', right:<i class="fas fa-file-signature"></i>, btnText: 'Download master contract', btnAction: () => {this.toggleEmailModal('Master Contract') }},
    invoiceGenerator: {prettyName: 'Invoice', right: <i class="fas fa-receipt"></i>, btnText: 'Generate invoice', btnAction: () => { this.toggleEmailModal('Invoice'); }}
  }

  goToEmailPage = (to) => {
    let search = to ? `/emails?to=${to}` : '/emails'
    this.props.history.push(search)
  }

  handleEmailFromUserPrefs = (emailSubject, emailType) => {
    let { preferences } = this.props.userStore

    switch (preferences.emailStyle){
    case EMAILPREFS.BROWSER:
      this.openGmailLink(emailSubject, emailType)
      break
    case EMAILPREFS.MODAL:
      this.generateEmail(emailType)
      this.toggleEmailModal(emailSubject)
      break
    case EMAILPREFS.APPLICATION:
      this.openMailToLink(emailSubject, emailType)
      break
    default:
      this.openMailToLink(emailSubject, emailType)
      break
    }
  }

  openGmailLink = async (emailSubject, emailType) => {
    
    let { userInfo } = this.state
    const emailInfo = await this.generateEmail(emailType)
    let link = buildGmailLink(userInfo.email, emailSubject, this.state.email_text)
    window.open(link, '_blank')
  }

  openMailToLink = async (emailSubject, emailType) => {
    let { userInfo } = this.state
    const emailInfo = await this.generateEmail(emailType)
    const link = buildMailToLink(userInfo.email, emailSubject, this.state.email_text)
    window.open(link)
  }

  toggleEmailModal = (emailSubject) => {
    this.state.showModal ?
      this.setState({
        showModal: !this.state.showModal,
        email_text: '',
        emailSubject
      }) :
      this.setState({ 
        showModal: !this.state.showModal, 
        emailSubject 
      })
  }

  generateEmail = async (emailType) => {
    let response
    let { lname, fname } = this.state.userInfo

    // future implementation TODO
      // await backend.generateEmail()

    switch (emailType) {
    case EMAILTYPES.WELCOME:
      response = await backend.generateWelcomeEmail(fname)
      break
    case EMAILTYPES.CONTRACT:
      response = await backend.generateContractEmail(fname)
      break
    case EMAILTYPES.NOROOMS:
      let month
      let { reservations } = this.state.userInfo
      if (reservations.length > 0) {
        let firstRes = reservations[0]
        month = new Date(firstRes.checkindate).getMonth()
      } else {
        month = prompt('Enter month')
      }

      response = await backend.generateNoRoomsEmail(fname, MONTHNAMES[month] || month)
      break
    }
    
    if (response.status === 200) {
      let { data } = response
      this.setState({ email_text: data.message })
    }
  }

  searchEmails = (event) => {
    event.persist()
    let { target } = event

    console.log(event)

    let filterd = this.state.originalEmails.filter(obj => obj.name.toUpperCase() === target.value.toUpperCase())
    this.setState({
      emailTemplates: filterd
    })

  }

  render() {
    return (
      <div>
      <Navi />
        <div className={'container'} style={{...gridStyle}}>
          <div style={{gridArea: 'left', gridRow: 1}}>
            <section style={{marginBottom: '25px'}}>
              <Emails data={this.emailStuff} title={'EMAIL'}/>
            </section>
            <section style={{marginBottom: '25px', maxHeight: '40vh', overflow: 'auto'}}>
              <Emails data={this.emailInfo} title={'RELATED DOCUMENTS'} doSearch={this.searchEmails} search />
            </section>
            {/* <section>
              <Emails data={this.documentsInfo} title={'DOWNLOAD DOCUMENTS'}/>
            </section> */}
          </div>
          <section style={{gridArea: 'right', gridRow: 1}}>
            <UserInfo data={this.state.userInfo} history={this.props.history} />
          </section>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly'}} className={'container'}>
          <div className='table large-screen' style={{gridArea: 'tbl'}}>
            <div>
              <Question helpText={`List of all the user's reservations. Search and filter to find a specific reservation.`} />
              <label>Locate a reservation</label>
              <ReservationTable lesseeId={this.state.userId} history={this.props.history}/>
            </div>
          </div>
        </div>
        <NewEmailModal 
          showModal={this.state.showModal} 
          toggleModal={this.toggleEmailModal} 
          email={this.state.userInfo.email || ''} 
          subject={this.state.emailSubject} 
          attachements={[]}
          email_text={this.state.email_text}
        />
      </div>
    )
  }

}

export default Info